#!/usr/bin/env python3
"""
NA Bug-Fixer — Entry Point
Dual-mode: GUI (default) or Headless/CI-CD (RUN_HEADLESS=True)
"""
import os
from agent.loop import BugFixerAgent

def main():
    headless = os.getenv("RUN_HEADLESS", "False").lower() == "true"
    agent = BugFixerAgent(headless=headless)

    if headless:
        print("[NA Bug-Fixer] Running in headless/CI-CD mode...")
        agent.run()
    else:
        from gui.app import launch_gui
        launch_gui(agent)

if __name__ == "__main__":
    main()

