import os
import stripe
from fastapi import APIRouter, Header, HTTPException, Request

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")


@router.post("/api/webhook")
async def stripe_webhook(
    request: Request, stripe_signature: str = Header(None)
):
    payload = await request.body()

    if not stripe_signature:
        raise HTTPException(status_code=400, detail="Missing stripe-signature header")

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, endpoint_secret
        )
    except ValueError:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the checkout session completed event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        customer_email = session.get("customer_email")
        amount_total = session.get("amount_total")  # In cents ($7900, $34900, $89900)
        client_reference_id = session.get("client_reference_id")
        metadata = session.get("metadata", {})

        # Map the amount or metadata to your Bug Fixer pricing tiers ($79, $349, $899)
        tier_mapping = {7900: "Starter", 34900: "Pro", 89900: "Enterprise"}
        purchased_tier = tier_mapping.get(amount_total, "Unknown")

        # TODO: Add your database fulfillment logic here (e.g., issue license key, activate account)
        print(
            f"Fulfilling order for {customer_email}: Tier -> {purchased_tier}"
            f" (Amount: {amount_total})"
        )

    return {"status": "success"}
