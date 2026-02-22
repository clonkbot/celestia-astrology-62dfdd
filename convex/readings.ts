import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const READING_TYPES = ["Birth Chart", "Cosmic Alignment", "Destiny Path", "Lunar Fortune", "Solar Blessing"];

const COSMIC_MESSAGES = [
  "The blockchain has recorded your cosmic signature. The universe acknowledges your presence.",
  "Your digital soul has been inscribed among the stars. The ethereal network embraces you.",
  "A new constellation forms in your honor. The decentralized cosmos celebrates your journey.",
  "The celestial ledger has marked this moment. Your destiny is forever sealed in blocks.",
  "Cosmic validators have confirmed your spiritual transaction. The galaxy nods in approval.",
];

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("readings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

export const create = mutation({
  args: {
    walletAddress: v.string(),
    readingType: v.string(),
    zodiacSign: v.string(),
    txHash: v.optional(v.string()),
    blockNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const seed = Date.now().toString() + args.walletAddress + args.zodiacSign;
    const hash = seed.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

    const reading = {
      userId,
      walletAddress: args.walletAddress,
      readingType: args.readingType,
      zodiacSign: args.zodiacSign,
      prediction: COSMIC_MESSAGES[Math.abs(hash) % COSMIC_MESSAGES.length],
      txHash: args.txHash,
      blockNumber: args.blockNumber,
      cosmicScore: (Math.abs(hash) % 100) + 1,
      createdAt: Date.now(),
    };

    const id = await ctx.db.insert("readings", reading);
    return { ...reading, _id: id };
  },
});

export const getByWallet = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("readings")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
      .order("desc")
      .take(10);
  },
});

export const getReadingTypes = query({
  args: {},
  handler: async () => {
    return READING_TYPES;
  },
});
