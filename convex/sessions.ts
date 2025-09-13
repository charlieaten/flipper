import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getBalance = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    return session?.tokenBalance || 0;
  },
});

// Get game session by user ID
export const getGameSession = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return session;
  },
});

// Create a new game session
export const createGameSession = mutation({
  args: {
    userId: v.string(),
    tokenBalance: v.number(),
    gameHistory: v.array(
      v.object({
        bet: v.number(),
        won: v.boolean(),
        side: v.union(v.literal("heads"), v.literal("tails")),
        timestamp: v.string(),
      })
    ),
    lastUpdated: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("sessions", args);
    return sessionId;
  },
});

// Update game session
export const updateGameSession = mutation({
  args: {
    userId: v.string(),
    tokenBalance: v.number(),
    gameHistory: v.array(
      v.object({
        bet: v.number(),
        won: v.boolean(),
        side: v.union(v.literal("heads"), v.literal("tails")),
        timestamp: v.string(),
      })
    ),
    lastUpdated: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!session) {
      return null;
    }

    await ctx.db.patch(session._id, {
      tokenBalance: args.tokenBalance,
      gameHistory: args.gameHistory,
      lastUpdated: args.lastUpdated,
    });

    return session._id;
  },
});

// Add tokens to user
export const addTokensToUser = mutation({
  args: {
    userId: v.string(),
    tokens: v.number(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (session) {
      await ctx.db.patch(session._id, {
        tokenBalance: session.tokenBalance + args.tokens,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      // Create new session if it doesn't exist
      await ctx.db.insert("sessions", {
        userId: args.userId,
        tokenBalance: args.tokens,
        gameHistory: [],
        lastUpdated: new Date().toISOString(),
      });
    }
  },
});
