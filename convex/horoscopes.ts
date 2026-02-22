import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PREDICTIONS = [
  "The stars align in your favor today. Trust your intuition and take bold steps forward.",
  "A cosmic wave of creativity washes over you. Express yourself freely and embrace new ideas.",
  "Mercury's influence brings clarity to complex situations. Communication is your superpower today.",
  "The moon whispers secrets of abundance. Financial opportunities may present themselves.",
  "Venus graces your sign with warmth. Love and friendship flourish under her gentle gaze.",
  "Mars ignites your inner fire. Channel this energy into productive pursuits.",
  "Jupiter expands your horizons. Travel, learning, or spiritual growth beckons.",
  "Saturn teaches valuable lessons today. Patience and discipline will be rewarded.",
  "Uranus sparks unexpected changes. Embrace the chaos and find freedom in uncertainty.",
  "Neptune enhances your dreams. Pay attention to the messages in your subconscious.",
  "Pluto transforms the shadows into light. Release what no longer serves you.",
  "The cosmic dance invites you to celebrate life's mysteries. Joy awaits those who seek it."
];

const COLORS = ["Cosmic Purple", "Stellar Gold", "Nebula Pink", "Aurora Green", "Midnight Blue", "Supernova Red", "Galaxy Silver", "Eclipse Black"];
const COMPATIBILITIES = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export const getDaily = query({
  args: { zodiacSign: v.string() },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0];

    const existing = await ctx.db
      .query("horoscopes")
      .withIndex("by_sign_date", (q) =>
        q.eq("zodiacSign", args.zodiacSign).eq("date", today)
      )
      .first();

    if (existing) return existing;

    // Generate deterministic prediction based on date and sign
    const seed = today.replace(/-/g, '') + args.zodiacSign;
    const hash = seed.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

    return {
      zodiacSign: args.zodiacSign,
      date: today,
      prediction: PREDICTIONS[Math.abs(hash) % PREDICTIONS.length],
      luckyNumber: (Math.abs(hash) % 99) + 1,
      luckyColor: COLORS[Math.abs(hash) % COLORS.length],
      compatibility: COMPATIBILITIES[Math.abs(hash + 5) % COMPATIBILITIES.length],
      cosmicEnergy: (Math.abs(hash) % 100) + 1,
    };
  },
});

export const generateDaily = mutation({
  args: { zodiacSign: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const today = new Date().toISOString().split('T')[0];

    const existing = await ctx.db
      .query("horoscopes")
      .withIndex("by_sign_date", (q) =>
        q.eq("zodiacSign", args.zodiacSign).eq("date", today)
      )
      .first();

    if (existing) return existing;

    const seed = today.replace(/-/g, '') + args.zodiacSign;
    const hash = seed.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

    const horoscope = {
      zodiacSign: args.zodiacSign,
      date: today,
      prediction: PREDICTIONS[Math.abs(hash) % PREDICTIONS.length],
      luckyNumber: (Math.abs(hash) % 99) + 1,
      luckyColor: COLORS[Math.abs(hash) % COLORS.length],
      compatibility: COMPATIBILITIES[Math.abs(hash + 5) % COMPATIBILITIES.length],
      cosmicEnergy: (Math.abs(hash) % 100) + 1,
      createdAt: Date.now(),
    };

    const id = await ctx.db.insert("horoscopes", horoscope);
    return { ...horoscope, _id: id };
  },
});

export const getAllSigns = query({
  args: {},
  handler: async () => {
    return ZODIAC_SIGNS;
  },
});
