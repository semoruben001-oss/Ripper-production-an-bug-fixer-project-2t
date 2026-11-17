"""Test the real agent against a real traceback.

Localize must read the actual codebase and rank the file where the error was
raised (agent/nodes.py, the innermost frame) first. With no model key set,
hypothesize must NOT fake a diagnosis — root_cause stays None.
"""
from agent.loop import BugFixerAgent

ERROR = """Traceback (most recent call last):
  File "main.py", line 42, in <module>
    agent = BugFixerAgent(headless=True)
  File "agent/loop.py", line 28, in __init__
    self.graph = build_graph()
  File "agent/nodes.py", line 10, in localize
    raise NameError("name 'search_index' is not defined")
NameError: name 'search_index' is not defined
"""

if __name__ == "__main__":
    agent = BugFixerAgent(headless=True)
    result = agent.run(ERROR)
    files = [f["path"] for f in result.get("files") or []]
    print("TOP FILES:", files)
    assert files and files[0] == "agent/nodes.py", f"expected agent/nodes.py first, got {files}"
    assert "agent/loop.py" in files, f"expected agent/loop.py in results, got {files}"
    assert "main.py" in files, f"expected main.py in results, got {files}"
    assert result.get("root_cause") is None, "no key set, root cause must be None (no fake diagnosis)"
    assert result.get("patch") is None, "no key set, no patch may be generated"
    print("LOCALIZE TEST PASSED")
