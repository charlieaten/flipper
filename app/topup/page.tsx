"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Coins, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Gateway: any;
  }
}

const customerData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address_line1: "123 Main Street",
  address_line2: "Apt 4B",
  address_city: "New York",
  address_state: "NY",
  address_zip: "10001",
  address_country: "US",
};

export default function TopUpPage() {
  const router = useRouter();
  const [userId] = useState("john.doe@example.com");
  const session = useQuery(api.sessions.getGameSession, { userId });
  const [gateway, setGateway] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cardElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPaymentGateway = async () => {
      if (window.Gateway) {
        const publishableKey = "foobar"; // Using the sample key from the attachment
        const gateway = new window.Gateway(publishableKey);
        await gateway.init();
        setGateway(gateway);

        const elements = gateway.elements();
        const card = elements.create("card", {
          style: {
            base: {
              fontSize: "16px",
              color: "#1a1a1a",
              "::placeholder": {
                color: "#9ca3af",
              },
            },
            invalid: {
              color: "#ef4444",
            },
          },
        });

        if (cardElementRef.current) {
          card.mount(cardElementRef.current);
          setCardElement(card);
        }
      } else {
        // Load the payment gateway script
        const script = document.createElement("script");
        script.src =
          "https://sandbox.orchestrate.global/assets/js/orchestrate.js";
        script.onload = async () => {
          const publishableKey = "foobar";
          const gateway = new window.Gateway(publishableKey);
          await gateway.init();
          setGateway(gateway);

          const elements = gateway.elements();
          const card = elements.create("card", {
            style: {
              base: {
                fontSize: "16px",
                color: "#1a1a1a",
                "::placeholder": {
                  color: "#9ca3af",
                },
              },
              invalid: {
                color: "#ef4444",
              },
            },
          });

          if (cardElementRef.current) {
            card.mount(cardElementRef.current);
            setCardElement(card);
          }
        };
        document.head.appendChild(script);
      }
    };

    loadPaymentGateway();
  }, []);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gateway || !cardElement) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, token } = await gateway.createToken(cardElement, {
        name: customerData.name,
        address_line1: customerData.address_line1,
        address_line2: customerData.address_line2,
        address_city: customerData.address_city,
        address_state: customerData.address_state,
        address_zip: customerData.address_zip,
        address_country: customerData.address_country,
      });

      if (error) throw error;

      const rechargeResponse = await fetch("/api/recharge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 99.99,
          tokens: 10000,
          token: token,
          userId: userId,
        }),
      });

      if (!rechargeResponse.ok) {
        throw new Error("Failed to process recharge");
      }

      const { status, client_secret } = await rechargeResponse.json();

      if (status === "succeeded") {
        router.push("/success?amount=99.99&tokens=10000");
      } else if (status === "requires_action") {
        // Handle additional authentication if needed
        const response = await gateway.confirmCardPayment(client_secret);
        if (response.paymentIntent.status === "succeeded") {
          router.push("/success?amount=99.99&tokens=10000");
        } else {
          throw new Error("Payment failed");
        }
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Coin Flip Casino</h1>
              <p className="text-sm text-muted-foreground">
                Top up your tokens
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Game
          </Button>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Add Tokens to Your Account
            </h2>
            <p className="text-muted-foreground">
              Current balance: {(session?.tokenBalance || 0).toLocaleString()}{" "}
              tokens
            </p>
          </div>

          {/* Package */}
          <div className="space-y-4">
            <h3 className="font-medium">Token Package</h3>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">10,000 gaming tokens</p>
                <p className="text-sm text-muted-foreground">
                  Premium token package
                </p>
              </div>
              <p className="text-xl font-semibold">$99.99</p>
            </div>
          </div>

          <Separator />

          {/* Payment Form */}
          <form onSubmit={handleTopUp} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Payment Method</h3>
              <div className="p-4 border rounded-lg bg-background">
                <div ref={cardElementRef} />
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Secured by Orchestrate encryption</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!gateway || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <span>Add 10,000 Tokens • $99.99</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
