import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Clock, ExternalLink, Star, Zap, Sparkles } from "lucide-react";

interface Reading {
  _id: string;
  userId: string;
  walletAddress: string;
  readingType: string;
  zodiacSign: string;
  prediction: string;
  txHash?: string;
  blockNumber?: number;
  cosmicScore: number;
  createdAt: number;
}

export function ReadingsHistory() {
  const readings = useQuery(api.readings.list);

  if (readings === undefined) {
    return (
      <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-6 md:p-8 flex justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-6 md:p-8 text-center">
        <Clock className="w-12 h-12 text-purple-400/30 mx-auto mb-4" />
        <h3 className="text-xl text-purple-200 mb-2">No Readings Yet</h3>
        <p className="text-purple-300/50 text-sm">
          Your on-chain cosmic readings will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl text-purple-100 mb-2">Your Cosmic History</h3>
        <p className="text-purple-300/50 text-sm">
          {readings.length} reading{readings.length !== 1 ? "s" : ""} recorded on Base
        </p>
      </div>

      <div className="space-y-3 md:space-y-4">
        {readings.map((reading: Reading, index: number) => (
          <motion.div
            key={reading._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-xl p-4 md:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-300" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-purple-100 font-medium">{reading.zodiacSign}</h4>
                    <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                      {reading.readingType.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-purple-300/60 text-xs md:text-sm italic max-w-md">
                    "{reading.prediction}"
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span className="text-amber-300/80 text-xs">Score: {reading.cosmicScore}</span>
                    </div>
                    <span className="text-purple-400/40 text-xs">
                      {new Date(reading.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {reading.txHash && (
                <a
                  href={`https://basescan.org/tx/${reading.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-purple-500/20 rounded-lg text-purple-300/70 hover:text-purple-200 text-xs transition-colors self-start sm:self-center"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="font-mono">{reading.txHash.slice(0, 8)}...</span>
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: readings.length * 0.1 }}
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <div className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl text-purple-100 font-light">{readings.length}</p>
          <p className="text-purple-400/60 text-xs">Total Readings</p>
        </div>
        <div className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl text-purple-100 font-light">
            {readings.filter((r: Reading) => r.txHash).length}
          </p>
          <p className="text-purple-400/60 text-xs">On-Chain</p>
        </div>
        <div className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl text-purple-100 font-light">
            {Math.round(readings.reduce((acc: number, r: Reading) => acc + r.cosmicScore, 0) / readings.length)}
          </p>
          <p className="text-purple-400/60 text-xs">Avg Score</p>
        </div>
        <div className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl md:text-3xl text-purple-100 font-light">
            {new Set(readings.map((r: Reading) => r.zodiacSign)).size}
          </p>
          <p className="text-purple-400/60 text-xs">Signs Explored</p>
        </div>
      </motion.div>
    </div>
  );
}
