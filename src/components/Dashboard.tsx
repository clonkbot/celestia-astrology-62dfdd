import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Wallet, Star, Sparkles, Moon, Sun,
  Zap, Heart, Clock, ChevronRight, ExternalLink,
  Menu, X
} from "lucide-react";
import { ZodiacWheel } from "./ZodiacWheel";
import { HoroscopeCard } from "./HoroscopeCard";
import { WalletConnect } from "./WalletConnect";
import { OnChainReading } from "./OnChainReading";
import { ReadingsHistory } from "./ReadingsHistory";

type Tab = "horoscope" | "reading" | "history";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const profile = useQuery(api.profiles.get);
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("horoscope");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (profile?.zodiacSign) {
      setSelectedSign(profile.zodiacSign);
    }
  }, [profile]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "horoscope", label: "Daily Horoscope", icon: <Star className="w-4 h-4" /> },
    { id: "reading", label: "On-Chain Reading", icon: <Zap className="w-4 h-4" /> },
    { id: "history", label: "Your Readings", icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen relative z-10 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a12]/80 border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
              <Moon className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-light tracking-[0.15em] text-purple-100">CELESTIA</h1>
              <p className="text-[10px] md:text-xs text-purple-400/60 tracking-wider hidden sm:block">BASECHAIN ASTROLOGY</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <WalletConnect />
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-purple-300/60 hover:text-purple-200 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-purple-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-purple-500/10 bg-[#0a0a12]/95 backdrop-blur-xl"
            >
              <div className="p-4 space-y-3">
                <WalletConnect />
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-purple-300/60 hover:text-purple-200 transition-colors text-sm border border-purple-500/20 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
            <span className="text-purple-300/80 text-xs md:text-sm tracking-wider">BASE CHAIN · 0x{profile?.walletAddress?.slice(2, 8) || "fd2d53"}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-fuchsia-200 to-purple-200 tracking-wide mb-2">
            Your Cosmic Journey Awaits
          </h2>
          <p className="text-purple-300/50 text-sm md:text-base">
            Record your celestial readings on the blockchain forever
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="inline-flex flex-wrap justify-center gap-2 p-1 md:p-2 rounded-2xl bg-white/[0.02] border border-purple-500/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl text-xs md:text-sm tracking-wider transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600/50 to-fuchsia-600/50 text-white"
                    : "text-purple-300/50 hover:text-purple-200 hover:bg-white/[0.02]"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeTab === "horoscope" && (
            <motion.div
              key="horoscope"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
                <ZodiacWheel
                  selectedSign={selectedSign}
                  onSelectSign={setSelectedSign}
                />
                <HoroscopeCard selectedSign={selectedSign} />
              </div>
            </motion.div>
          )}

          {activeTab === "reading" && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OnChainReading selectedSign={selectedSign} />
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ReadingsHistory />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
