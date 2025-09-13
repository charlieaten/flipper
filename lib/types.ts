export interface TopUpAttempt {
  id: string;
  paymentId: string;
  userId: string;
  amount: number;
  tokens: number;
  status: "pending" | "succeeded" | "failed" | "expired";
  createdAt: string;
  updatedAt: string;
  metadata?: {
    order_id?: string;
    customer_email?: string;
    customer_name?: string;
  };
}

export interface PaymentWebhook {
  api_version: string;
  type:
    | "payment.created"
    | "payment.succeeded"
    | "payment.failed"
    | "payment.expired";
  payload: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      email: string;
      name: string;
    };
    metadata: {
      order_id?: string;
      tokens?: string;
    };
  };
  timestamp: string;
}

export interface GameSession {
  userId: string;
  tokenBalance: number;
  gameHistory: Array<{
    bet: number;
    won: boolean;
    side: "heads" | "tails";
    timestamp: string;
  }>;
  lastUpdated: string;
}
