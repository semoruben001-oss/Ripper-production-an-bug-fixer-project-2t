"""
Smoke tests for NA Bug-Fixer.
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


def test_agent_state_import():
    """Verify AgentState TypedDict is importable."""
    from agent.loop import AgentState
    state = AgentState(error="test", iterations=0, max_iterations=5)
    assert state["iterations"] == 0


def test_graph_builds():
    """Verify the LangGraph pipeline compiles without errors."""
    from agent.loop import build_graph
    graph = build_graph()
    assert graph is not None


def test_nodes_importable():
    """Verify all agent node functions are importable."""
    from agent.nodes import ingest, localize, hypothesize, draft_patch, deploy
    assert callable(ingest)
    assert callable(localize)
    assert callable(hypothesize)
    assert callable(draft_patch)
    assert callable(deploy)
