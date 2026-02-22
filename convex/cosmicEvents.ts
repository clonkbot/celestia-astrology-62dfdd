import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("cosmicEvents")
      .withIndex("by_time")
      .order("desc")
      .take(50);

    return events.filter(e => e.startTime <= now && (!e.endTime || e.endTime > now));
  },
});

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("cosmicEvents")
      .withIndex("by_time")
      .order("asc")
      .take(50);

    return events.filter(e => e.startTime > now).slice(0, 5);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    eventType: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    affectedSigns: v.array(v.string()),
    intensity: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("cosmicEvents", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
