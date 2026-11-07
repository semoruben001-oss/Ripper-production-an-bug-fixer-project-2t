import os
from fastapi import FastAPI
from agent.loop import BugFixerAgent

app = FastAPI()


@app.get("/")
async def root():
    return {"status": "Agent is running"}


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

