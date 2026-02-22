import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const upsert = mutation({
  args: {
    walletAddress: v.optional(v.string()),
    zodiacSign: v.optional(v.string()),
    birthDate: v.optional(v.string()),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
      });
      return existing._id;
    }

    return await ctx.db.insert("profiles", {
      userId,
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const connectWallet = mutation({
  args: {
    walletAddress: v.string(),
    chainId: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Update profile with wallet
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, { walletAddress: args.walletAddress });
    } else {
      await ctx.db.insert("profiles", {
        userId,
        walletAddress: args.walletAddress,
        createdAt: Date.now(),
      });
    }

    // Log connection
    await ctx.db.insert("walletConnections", {
      userId,
      walletAddress: args.walletAddress,
      chainId: args.chainId,
      connectedAt: Date.now(),
    });

    return { success: true };
  },
});
