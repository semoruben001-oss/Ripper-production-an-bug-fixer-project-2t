"""
BugFixerAgent — LangGraph agentic loop
Phases: Ingest → Localize → Hypothesize → Draft → Validate → Deploy
"""
from langgraph.graph import StateGraph
from agent.nodes import ingest, localize, hypothesize, draft_patch, validate, deploy

def build_graph():
    graph = StateGraph()
    graph.add_node("ingest", ingest)
    graph.add_node("localize", localize)
    graph.add_node("hypothesize", hypothesize)
    graph.add_node("draft_patch", draft_patch)
    graph.add_node("validate", validate)
    graph.add_node("deploy", deploy)

    graph.set_entry_point("ingest")
    graph.add_edge("ingest", "localize")
    graph.add_edge("localize", "hypothesize")
    graph.add_edge("hypothesize", "draft_patch")
    graph.add_edge("draft_patch", "validate")
    graph.add_edge("validate", "deploy")

    return graph.compile()

class BugFixerAgent:
    MAX_ITERATIONS = 5  # Safety: hard cap on retry loops

    def __init__(self, headless=False):
        self.headless = headless
        self.graph = build_graph()

    def run(self, error_input=None):
        state = {"error": error_input, "iterations": 0, "max_iterations": self.MAX_ITERATIONS}
        return self.graph.invoke(state)

