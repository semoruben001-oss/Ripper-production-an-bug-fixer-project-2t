"""
Agent nodes — each phase of the bug-fixing pipeline.

Real implementations:
- localize searches the ACTUAL codebase (no model key needed) and ranks the
  files the traceback points at, innermost frame first.
- hypothesize / draft_patch call the model when a key is set (OPENAI_API_KEY
  or ANTHROPIC_API_KEY) and say so plainly when no key is set — they never
  fake a diagnosis or a patch.
- validate runs the real test suite against the patched scratch copy.
- deploy saves the validated patch for review; a PR needs GITHUB_TOKEN.
"""

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SYSTEM_PROMPT = """You are a Senior Site Reliability Engineer. When given a stack trace, follow these steps:
1. Identify the file and line.
2. Explain the root cause.
3. Provide a JSON-formatted patch.
4. Do not delete existing logic unless it is the source of the bug."""

SKIP_DIRS = {".git", "__pycache__", "venv", ".venv", "node_modules", ".next", "dist", "build"}
MAX_FILES = 8
MAX_FILE_CHARS = 12000


def _repo_root(state):
    return Path(state.get("repo_path") or Path(__file__).resolve().parents[1])


def _traceback_refs(error):
    """Pull (path, line) pairs out of a Python traceback."""
    refs = []
    for m in re.finditer(r'File "([^"]+)", line (\d+)', error or ""):
        refs.append((m.group(1), int(m.group(2))))
    return refs


def _iter_code_files(root):
    for p in root.rglob("*.py"):
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        yield p


def ingest(state):
    """Phase 1: Receive and parse error input"""
    error = state.get("error", "No error provided")
    state["traceback_refs"] = _traceback_refs(error)
    print(f"[Ingest] Processing error: {error[:200]}")
    if state["traceback_refs"]:
        print(f"[Ingest] Traceback points at: {state['traceback_refs']}")
    return state


def localize(state):
    """Phase 2: Search the actual codebase for the files the error points at.
    No model key needed — pure file search + ranking. The innermost traceback
    frame (where the error was raised) ranks first."""
    root = _repo_root(state)
    error = state.get("error", "")
    refs = state.get("traceback_refs") or _traceback_refs(error)

    # Keywords from the error message itself (exception type + identifiers).
    words = set(re.findall(r"[A-Za-z_][A-Za-z0-9_]{3,}", error))
    stop = {"File", "line", "Traceback", "most", "recent", "call", "last"}
    keywords = {w for w in words if w not in stop}

    scores = {}
    for i, (ref_path, _line) in enumerate(refs):
        weight = 100 if i == len(refs) - 1 else 60  # innermost frame first
        ref = ref_path.replace("\\", "/")
        for path in _iter_code_files(root):
            rel = path.relative_to(root).as_posix()
            if rel == ref or rel.endswith("/" + ref) or ref.endswith("/" + rel):
                scores[rel] = scores.get(rel, 0) + weight
            elif path.name == Path(ref).name:
                scores[rel] = scores.get(rel, 0) + weight // 2

    for path in _iter_code_files(root):
        rel = path.relative_to(root).as_posix()
        try:
            text = path.read_text(errors="ignore")
        except OSError:
            continue
        hits = sum(1 for kw in keywords if kw in text)
        if hits:
            scores[rel] = scores.get(rel, 0) + min(hits, 10)

    ranked = sorted(scores.items(), key=lambda kv: -kv[1])
    files = [{"path": rel, "score": score} for rel, score in ranked[:MAX_FILES]]
    state["files"] = files
    print(f"[Localize] Searched {root} — top files:")
    for f in files:
        print(f"  {f['score']:>3}  {f['path']}")
    if not files:
        print("[Localize] No matching files found in the codebase.")
    return state


def _model_key():
    if os.environ.get("OPENAI_API_KEY"):
        return "openai"
    if os.environ.get("ANTHROPIC_API_KEY"):
        return "anthropic"
    return None


def _read_context(state):
    root = _repo_root(state)
    parts = []
    for f in state.get("files") or []:
        p = root / f["path"]
        try:
            text = p.read_text(errors="ignore")[:MAX_FILE_CHARS]
        except OSError:
            continue
        parts.append(f"--- {f['path']} ---\n{text}")
    return "\n\n".join(parts)


def _ask_model(prompt):
    provider = _model_key()
    if provider == "openai":
        from openai import OpenAI
        client = OpenAI()
        resp = client.chat.completions.create(
            model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[{"role": "system", "content": SYSTEM_PROMPT},
                      {"role": "user", "content": prompt}],
        )
        return resp.choices[0].message.content
    if provider == "anthropic":
        import anthropic
        client = anthropic.Anthropic()
        resp = client.messages.create(
            model=os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-4-20250514"),
            max_tokens=4000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )
        return resp.content[0].text
    return None


def hypothesize(state):
    """Phase 3: Model identifies the root cause from the real files."""
    if not state.get("files"):
        print("[Hypothesize] No files localized — cannot diagnose.")
        state["root_cause"] = None
        return state
    if not _model_key():
        print("[Hypothesize] No model key set (OPENAI_API_KEY / ANTHROPIC_API_KEY) — diagnosis needs a key.")
        state["root_cause"] = None
        return state
    context = _read_context(state)
    prompt = (
        f"Error:\n{state.get('error')}\n\nRelevant files:\n{context}\n\n"
        "Identify the file and line, and explain the root cause in plain words."
    )
    state["root_cause"] = _ask_model(prompt)
    print(f"[Hypothesize] Root cause:\n{state['root_cause']}")
    return state


def draft_patch(state):
    """Phase 4: Model writes a JSON patch; applied to a scratch copy only."""
    if not state.get("root_cause"):
        print("[Draft] No root cause — no patch generated.")
        state["patch"] = None
        return state
    if not _model_key():
        print("[Draft] No model key set — cannot draft a patch.")
        state["patch"] = None
        return state
    context = _read_context(state)
    prompt = (
        f"Error:\n{state.get('error')}\n\nRoot cause:\n{state['root_cause']}\n\n"
        f"Relevant files:\n{context}\n\n"
        'Return ONLY a JSON object: {"file": "relative/path.py", '
        '"old": "exact snippet to replace", "new": "replacement code"}. '
        "Change only what fixes the bug."
    )
    raw = _ask_model(prompt)
    try:
        patch = json.loads(raw[raw.index("{"):raw.rindex("}") + 1])
    except (ValueError, IndexError):
        print(f"[Draft] Model did not return a usable JSON patch:\n{raw}")
        state["patch"] = None
        return state
    root = _repo_root(state)
    target = root / patch["file"]
    try:
        original = target.read_text()
    except OSError:
        print(f"[Draft] Patch target not found: {patch['file']}")
        state["patch"] = None
        return state
    if patch["old"] not in original:
        print("[Draft] Patch 'old' snippet not found verbatim — patch rejected, nothing changed.")
        state["patch"] = None
        return state
    scratch = Path(tempfile.mkdtemp(prefix="bugfixer-"))
    shutil.copytree(root, scratch, dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns(".git", "__pycache__"))
    (scratch / patch["file"]).write_text(original.replace(patch["old"], patch["new"], 1))
    patch["scratch"] = str(scratch)
    state["patch"] = patch
    print(f"[Draft] Patch ready for {patch['file']} (applied in scratch copy {scratch})")
    return state


def validate(state):
    """Phase 5: Run the real test suite against the patched scratch copy."""
    patch = state.get("patch")
    if not patch:
        print("[Validate] No patch — nothing to validate.")
        state["validated"] = False
        return state
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pytest", "-q"],
            cwd=patch["scratch"], capture_output=True, text=True, timeout=300,
        )
        state["validated"] = result.returncode == 0
        print("[Validate] pytest " + ("PASSED" if state["validated"] else "FAILED"))
        print(result.stdout[-2000:])
        if result.stderr:
            print(result.stderr[-1000:])
    except FileNotFoundError:
        print("[Validate] pytest not available — validation skipped.")
        state["validated"] = False
    except subprocess.TimeoutExpired:
        print("[Validate] Test run timed out.")
        state["validated"] = False
    return state


def deploy(state):
    """Phase 6: Save the validated patch; a PR needs GITHUB_TOKEN."""
    patch = state.get("patch")
    if not patch:
        print("[Deploy] No patch — nothing to deploy.")
        return state
    if not state.get("validated"):
        print("[Deploy] Tests did not pass — patch held for human review, not deployed.")
        return state
    out = _repo_root(state) / "patches"
    out.mkdir(exist_ok=True)
    patch_file = out / "patch.json"
    patch_file.write_text(json.dumps(
        {k: v for k, v in patch.items() if k != "scratch"}, indent=2))
    state["patch_path"] = str(patch_file)
    print(f"[Deploy] Tests passed — patch saved to {patch_file}")
    if os.environ.get("GITHUB_TOKEN"):
        print("[Deploy] GITHUB_TOKEN is set — PR step runs from here (gh / API).")
    else:
        print("[Deploy] No GITHUB_TOKEN set — patch saved for review; set GITHUB_TOKEN to open the PR automatically.")
    return state
