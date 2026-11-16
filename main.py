import os

from fastapi import FastAPI
from agent.loop import BugFixerAgent

app = FastAPI()

try:
    from api.stripe_checkout import router as stripe_checkout_router
    from api.stripe_webhook import router as stripe_webhook_router

    app.include_router(stripe_checkout_router)
    app.include_router(stripe_webhook_router)
except ImportError as exc:
    print(f"[NA Bug-Fixer] Stripe billing routes not loaded: {exc}")


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
        try:
            from gui.app import launch_gui
        except ImportError:
            raise SystemExit(
                "[NA Bug-Fixer] GUI mode needs the gui/ package, which is not "
                "installed. Run headless instead: RUN_HEADLESS=true python main.py"
            )
        launch_gui(agent)


if __name__ == "__main__":
    main()
