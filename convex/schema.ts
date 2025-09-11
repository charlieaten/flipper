import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  topups: defineTable({
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
  })
    .index("by_userId", ["userId"])
    .index("by_paymentId", ["paymentId"])
    .index("by_status", ["status"]),

  sessions: defineTable({
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
  }).index("by_userId", ["userId"]),
});
