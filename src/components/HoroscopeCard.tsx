import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Sparkles, Heart, Hash, Palette, Zap } from "lucide-react";

interface HoroscopeCardProps {
  selectedSign: string | null;
}

export function HoroscopeCard({ selectedSign }: HoroscopeCardProps) {
  const horoscope = useQuery(
    api.horoscopes.getDaily,
    selectedSign ? { zodiacSign: selectedSign } : "skip"
  );

  if (!selectedSign) {
    return (
      <div className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-6 md:p-8 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        <div className="text-center">
          <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-purple-400/30 mx-auto mb-4" />
          <p className="text-purple-300/50 text-sm md:text-base">Select your zodiac sign to reveal today's cosmic message</p>
        </div>
      </div>
    );
  }

  if (!horoscope) {
    return (
      <div className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-6 md:p-8 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      key={selectedSign}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-6 md:p-8 min-h-[300px] md:min-h-[400px]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-light text-purple-100 tracking-wide">{selectedSign}</h3>
          <p className="text-purple-400/50 text-xs md:text-sm tracking-wider">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-amber-300 text-sm">{horoscope.cosmicEnergy}%</span>
        </div>
      </div>

      {/* Prediction */}
      <div className="mb-6 md:mb-8">
        <p className="text-purple-200/80 text-sm md:text-base leading-relaxed italic">
          "{horoscope.prediction}"
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white/[0.02] rounded-xl p-3 md:p-4 border border-purple-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-3 h-3 md:w-4 md:h-4 text-purple-400/60" />
            <span className="text-purple-400/60 text-[10px] md:text-xs tracking-wider">LUCKY NUMBER</span>
          </div>
          <p className="text-xl md:text-2xl text-purple-100 font-light">{horoscope.luckyNumber}</p>
        </div>

        <div className="bg-white/[0.02] rounded-xl p-3 md:p-4 border border-purple-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-3 h-3 md:w-4 md:h-4 text-purple-400/60" />
            <span className="text-purple-400/60 text-[10px] md:text-xs tracking-wider">LUCKY COLOR</span>
          </div>
          <p className="text-base md:text-lg text-purple-100 font-light">{horoscope.luckyColor}</p>
        </div>

        <div className="col-span-2 bg-white/[0.02] rounded-xl p-3 md:p-4 border border-purple-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-fuchsia-400/60" />
            <span className="text-purple-400/60 text-[10px] md:text-xs tracking-wider">BEST COMPATIBILITY</span>
          </div>
          <p className="text-base md:text-lg text-fuchsia-200 font-light">{horoscope.compatibility}</p>
        </div>
      </div>

      {/* Cosmic Energy Bar */}
      <div className="mt-4 md:mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-400/60 text-[10px] md:text-xs tracking-wider">COSMIC ENERGY</span>
          <span className="text-purple-300 text-xs">{horoscope.cosmicEnergy}/100</span>
        </div>
        <div className="h-1.5 md:h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${horoscope.cosmicEnergy}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
