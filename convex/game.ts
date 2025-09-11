import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const flip = mutation({
  args: {
    userId: v.string(),
    betAmount: v.number(),
    selection: v.union(v.literal("heads"), v.literal("tails")),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!session) {
      throw new Error("Session not found");
    }

    if (args.betAmount > session.tokenBalance) {
      throw new Error("Insufficient tokens");
    }

    const result = Math.random() < 0.5 ? "heads" : "tails";
    const won = result === args.selection;

    const newBalance = won
      ? session.tokenBalance + args.betAmount
      : session.tokenBalance - args.betAmount;

    const entry = {
      bet: args.betAmount,
      won,
      side: result,
      timestamp: new Date().toISOString(),
    } as const;

    await ctx.db.patch(session._id, {
      tokenBalance: newBalance,
      gameHistory: [...session.gameHistory, entry],
      lastUpdated: new Date().toISOString(),
    });

    return entry;
  },
});
