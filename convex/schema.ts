import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User profiles with wallet and astrology data
  profiles: defineTable({
    userId: v.id("users"),
    walletAddress: v.optional(v.string()),
    zodiacSign: v.optional(v.string()),
    birthDate: v.optional(v.string()),
    displayName: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_wallet", ["walletAddress"]),

  // Daily horoscopes
  horoscopes: defineTable({
    zodiacSign: v.string(),
    date: v.string(),
    prediction: v.string(),
    luckyNumber: v.number(),
    luckyColor: v.string(),
    compatibility: v.string(),
    cosmicEnergy: v.number(),
    createdAt: v.number(),
  }).index("by_sign_date", ["zodiacSign", "date"]),

  // On-chain readings/transactions
  readings: defineTable({
    userId: v.id("users"),
    walletAddress: v.string(),
    readingType: v.string(),
    zodiacSign: v.string(),
    prediction: v.string(),
    txHash: v.optional(v.string()),
    blockNumber: v.optional(v.number()),
    cosmicScore: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_wallet", ["walletAddress"]),

  // Community cosmic events
  cosmicEvents: defineTable({
    title: v.string(),
    description: v.string(),
    eventType: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    affectedSigns: v.array(v.string()),
    intensity: v.number(),
    createdAt: v.number(),
  }).index("by_time", ["startTime"]),

  // Wallet connections log
  walletConnections: defineTable({
    userId: v.id("users"),
    walletAddress: v.string(),
    chainId: v.number(),
    connectedAt: v.number(),
  }).index("by_user", ["userId"]),
});
