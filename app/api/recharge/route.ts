import { ConvexOperations } from "@/lib/convex-operations";
import { Gateway } from "@/lib/gateway";
import { TopUpAttempt } from "@/lib/types";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, tokens, token, userId } = await request.json();

    const paymentResponse = await Gateway.post("api/v1/payments", {
      json: {
        account_id: "cfd301a0-e7f5-48a8-98d1-ed817147e717",
        amount: amount,
        cancel_url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/cancel?amount=${amount}&tokens=${tokens}`,
        currency: "USD",
        customer: {
          email: "john.doe@example.com",
          name: "John Doe",
        },
        description: `Purchase of ${tokens.toLocaleString()} gaming tokens`,
        expires_in: 3600,
        metadata: {
          tokens: tokens.toString(),
          user_id: userId,
        },
        success_url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/success?amount=${amount}&tokens=${tokens}`,
      },
    });

    if (!paymentResponse.ok) {
      throw new Error(`Payment creation failed: ${paymentResponse.statusText}`);
    }

    const payment = await paymentResponse.json();

    const confirmPaymentResponse = await Gateway.put(
      `api/v1/payments/${payment.id}/confirm`,
      { json: { token: token } }
    );

    if (!confirmPaymentResponse.ok) {
      throw new Error(
        `Payment confirmation failed: ${confirmPaymentResponse.statusText}`
      );
    }

    const confirmData = await confirmPaymentResponse.json();

    // Create a top-up attempt record
    const topUpAttempt: TopUpAttempt = {
      id: `topup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentId: payment.id,
      userId: userId || "john.doe@example.com", // Fallback to default user
      amount: amount,
      tokens: tokens,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        order_id: payment.id,
        customer_email: "john.doe@example.com",
        customer_name: "John Doe",
      },
    };

    await ConvexOperations.createTopUpAttempt(topUpAttempt);
    console.log("Created top-up attempt:", topUpAttempt.id);

    return NextResponse.json({
      status: confirmData.status,
      client_secret: confirmData.client_secret,
      topUpAttemptId: topUpAttempt.id,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
