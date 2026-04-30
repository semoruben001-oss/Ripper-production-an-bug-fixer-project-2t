"""
Agent nodes — each phase of the bug-fixing pipeline
"""

SYSTEM_PROMPT = """You are a Senior Site Reliability Engineer. When given a stack trace, follow these steps:
1. Identify the file and line.
2. Explain the root cause.
3. Provide a JSON-formatted patch.
4. Do not delete existing logic unless it is the source of the bug."""

def ingest(state):
    """Phase 1: Receive and parse error input"""
    print(f"[Ingest] Processing error: {state.get(\"error\", \"No error provided\")}")
    return state

def localize(state):
    """Phase 2: Use RAG to find relevant files"""
    print("[Localize] Searching codebase for relevant context...")
    return state

def hypothesize(state):
    """Phase 3: LLM identifies root cause"""
    print("[Hypothesize] Generating root cause analysis...")
    return state

def draft_patch(state):
    """Phase 4: Generate JSON-structured patch"""
    print("[Draft] Generating surgical patch...")
    return state

def validate(state):
    """Phase 5: Run tests in Docker sandbox"""
    import subprocess
    print("[Validate] Running test suite in Docker...")
    result = subprocess.run(
        ["docker", "run", "--rm", "-v", f"{__file__}:/app", "my-test-runner", "pytest"],
        capture_output=True
    )
    state["validated"] = result.returncode == 0
    return state

def deploy(state):
    """Phase 6: Open PR if validated, else retry"""
    if state.get("validated"):
        print("[Deploy] Tests passed — opening PR...")
    else:
        print("[Deploy] Tests failed — flagging for human review.")
    return state

