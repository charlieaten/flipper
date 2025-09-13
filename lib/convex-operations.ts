import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { GameSession, TopUpAttempt } from "./types";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export class ConvexOperations {
  // Top-up attempt operations
  static async createTopUpAttempt(attempt: TopUpAttempt): Promise<void> {
    await convex.mutation(api.topups.createTopUpAttempt, {
      id: attempt.id,
      paymentId: attempt.paymentId,
      userId: attempt.userId,
      amount: attempt.amount,
      tokens: attempt.tokens,
      status: attempt.status,
      createdAt: attempt.createdAt,
      updatedAt: attempt.updatedAt,
      metadata: attempt.metadata,
    });
  }

  static async updateTopUpAttemptStatus(
    paymentId: string,
    status: TopUpAttempt["status"]
  ): Promise<TopUpAttempt | null> {
    const result = await convex.mutation(api.topups.updateTopUpAttemptStatus, {
      paymentId,
      status,
    });

    return result;
  }

  static async getTopUpAttempt(id: string): Promise<TopUpAttempt | null> {
    const result = await convex.query(api.topups.getTopUpAttempt, { id });
    return result;
  }

  // Game session operations
  static async getGameSession(userId: string): Promise<GameSession | null> {
    const result = await convex.query(api.sessions.getGameSession, { userId });
    return result;
  }

  static async createGameSession(session: GameSession): Promise<void> {
    await convex.mutation(api.sessions.createGameSession, {
      userId: session.userId,
      tokenBalance: session.tokenBalance,
      gameHistory: session.gameHistory,
      lastUpdated: session.lastUpdated,
    });
  }

  static async updateGameSession(session: GameSession): Promise<void> {
    await convex.mutation(api.sessions.updateGameSession, {
      userId: session.userId,
      tokenBalance: session.tokenBalance,
      gameHistory: session.gameHistory,
      lastUpdated: session.lastUpdated,
    });
  }

  static async addTokensToUser(userId: string, tokens: number): Promise<void> {
    await convex.mutation(api.sessions.addTokensToUser, {
      userId,
      tokens,
    });
  }
}
