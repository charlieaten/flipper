import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const topups = await ctx.db.query("topups").order("desc").collect();
    return topups;
  },
});

// Create a new top-up attempt
export const createTopUpAttempt = mutation({
  args: {
    id: v.string(),
    paymentId: v.string(),
    userId: v.string(),
    amount: v.number(),
    tokens: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("expired")
    ),
    createdAt: v.string(),
    updatedAt: v.string(),
    metadata: v.optional(
      v.object({
        order_id: v.optional(v.string()),
        customer_email: v.optional(v.string()),
        customer_name: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const topUpAttemptId = await ctx.db.insert("topups", args);
    return topUpAttemptId;
  },
});

// Update top-up attempt status
export const updateTopUpAttemptStatus = mutation({
  args: {
    paymentId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("expired")
    ),
  },
  handler: async (ctx, args) => {
    const attempt = await ctx.db
      .query("topups")
      .withIndex("by_paymentId", (q) => q.eq("paymentId", args.paymentId))
      .first();

    if (!attempt) {
      return null;
    }

    await ctx.db.patch(attempt._id, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    });

    return {
      ...attempt,
      status: args.status,
      updatedAt: new Date().toISOString(),
    };
  },
});

// Get top-up attempt by ID
export const getTopUpAttempt = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const attempt = await ctx.db
      .query("topups")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    return attempt;
  },
});
