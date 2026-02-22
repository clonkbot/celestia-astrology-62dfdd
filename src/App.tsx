import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-hidden relative">
      {/* Cosmic background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d1a] via-[#0a0a12] to-[#050508]" />
        <div className="stars" />
        <div className="stars2" />
        <div className="stars3" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-[80px]" />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center relative z-10"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 md:w-24 md:h-24"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="cosmicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#cosmicGrad)" strokeWidth="2" strokeDasharray="20 10" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="url(#cosmicGrad)" strokeWidth="1.5" strokeDasharray="10 15" />
                  <circle cx="50" cy="50" r="8" fill="url(#cosmicGrad)" />
                </svg>
              </motion.div>
              <p className="text-purple-300/80 font-light tracking-[0.3em] text-xs md:text-sm">ALIGNING THE COSMOS</p>
            </div>
          </motion.div>
        ) : !isAuthenticated ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AuthScreen />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 text-center z-50 bg-gradient-to-t from-[#0a0a12] to-transparent">
        <p className="text-[10px] md:text-xs text-purple-300/40 tracking-wide">
          Requested by <span className="text-purple-400/60">@jianke2</span> · Built by <span className="text-purple-400/60">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}
