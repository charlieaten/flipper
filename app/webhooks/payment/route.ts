import { ConvexOperations } from "@/lib/convex-operations";
import { PaymentWebhook } from "@/lib/types";
import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";

// Webhook signature validation
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-webhook-signature");

    // Verify webhook signature if provided
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      if (!verifyWebhookSignature(body, signature, webhookSecret)) {
        console.error("Invalid webhook signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const webhook: PaymentWebhook = JSON.parse(body);
    console.log("Received webhook:", webhook.type, webhook.payload.id);

    const { type, payload } = webhook;

    switch (type) {
      case "payment.created":
        // TODO: Here you could run a check to see if the payment is already in the database
        // If it is not, then something must have gone wrong and you should investigate
        break;
      case "payment.succeeded":
        await handlePaymentSucceeded(payload);
        break;
      case "payment.failed":
        await handlePaymentFailed(payload);
        break;
      case "payment.expired":
        await handlePaymentExpired(payload);
        break;
      default:
        console.log("Unknown webhook type:", type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(payload: PaymentWebhook["payload"]) {
  console.log("Payment succeeded:", payload.id);

  // Update top-up attempt status
  const updatedAttempt = await ConvexOperations.updateTopUpAttemptStatus(
    payload.id,
    "succeeded"
  );

  if (updatedAttempt) {
    // Add tokens to user's account
    await ConvexOperations.addTokensToUser(
      updatedAttempt.userId,
      updatedAttempt.tokens
    );
    console.log(
      `Added ${updatedAttempt.tokens} tokens to user ${updatedAttempt.userId}`
    );
  } else {
    console.error("Could not find top-up attempt for payment:", payload.id);
  }
}

async function handlePaymentFailed(payload: PaymentWebhook["payload"]) {
  console.log("Payment failed:", payload.id);

  // Update top-up attempt status
  await ConvexOperations.updateTopUpAttemptStatus(payload.id, "failed");
  console.log("Updated top-up attempt status to failed");
}

async function handlePaymentExpired(payload: PaymentWebhook["payload"]) {
  console.log("Payment expired:", payload.id);

  // Update top-up attempt status
  await ConvexOperations.updateTopUpAttemptStatus(payload.id, "expired");
  console.log("Updated top-up attempt status to expired");
}
