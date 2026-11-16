import os
import stripe
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


class CheckoutRequest(BaseModel):
    tier: str  # Expected values: "starter", "pro", or "enterprise"
    success_url: str
    cancel_url: str


# Mapping your exact tier names to their cent-based pricing amounts
TIER_PRICES = {
    "starter": {"name": "Bug Fixer Starter", "amount": 7900},  # $79.00
    "pro": {"name": "Bug Fixer Pro", "amount": 34900},  # $349.00
    "enterprise": {
        "name": "Bug Fixer Enterprise",
        "amount": 89900,
    },  # $899.00
}


@router.post("/api/create-checkout-session")
async def create_checkout_session(body: CheckoutRequest):
    tier_key = body.tier.lower()

    if tier_key not in TIER_PRICES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid tier selected. Choose from 'starter', 'pro', or"
                " 'enterprise'."
            ),
        )

    tier_info = TIER_PRICES[tier_key]

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": tier_info["name"],
                    },
                    "unit_amount": tier_info["amount"],
                    # Monthly recurring billing, not a one-time charge.
                    "recurring": {"interval": "month"},
                },
                "quantity": 1,
            }],
            mode="subscription",
            success_url=body.success_url,
            cancel_url=body.cancel_url,
        )
        return {"checkout_url": checkout_session.url}

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
