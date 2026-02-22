import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { motion } from "framer-motion";
import { Star, Sparkles, Moon, Sun, Mail, Lock, User } from "lucide-react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials. Please try again." : "Could not create account. Try a different email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnonymous = async () => {
    setIsSubmitting(true);
    try {
      await signIn("anonymous");
    } catch {
      setError("Could not continue as guest.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-4"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Star className="w-20 h-20 md:w-24 md:h-24 text-purple-400/30" strokeWidth={0.5} />
              </motion.div>
              <Moon className="w-10 h-10 md:w-12 md:h-12 text-purple-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-fuchsia-200 to-purple-200 mb-2">
            CELESTIA
          </h1>
          <p className="text-purple-300/60 text-xs md:text-sm tracking-[0.15em]">ON-CHAIN ASTROLOGY · BASECHAIN</p>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="backdrop-blur-xl bg-white/[0.03] border border-purple-500/20 rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-900/20"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-200/80 text-sm tracking-wider">
              {flow === "signIn" ? "WELCOME BACK, STARGAZER" : "JOIN THE COSMOS"}
            </span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
              <input
                name="email"
                type="email"
                placeholder="cosmic@email.com"
                required
                className="w-full bg-white/[0.03] border border-purple-500/20 rounded-xl py-3 md:py-4 pl-12 pr-4 text-purple-100 placeholder-purple-300/30 focus:outline-none focus:border-purple-400/50 transition-colors text-sm md:text-base"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-white/[0.03] border border-purple-500/20 rounded-xl py-3 md:py-4 pl-12 pr-4 text-purple-100 placeholder-purple-300/30 focus:outline-none focus:border-purple-400/50 transition-colors text-sm md:text-base"
              />
            </div>

            <input name="flow" type="hidden" value={flow} />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400/80 text-xs md:text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 md:py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-medium tracking-wider text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">
                {isSubmitting ? "CHANNELING..." : flow === "signIn" ? "ENTER THE COSMOS" : "BEGIN YOUR JOURNEY"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-purple-500/20" />
            <span className="text-purple-400/40 text-xs">OR</span>
            <div className="flex-1 h-px bg-purple-500/20" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnonymous}
            disabled={isSubmitting}
            className="w-full mt-4 py-3 md:py-4 bg-white/[0.03] border border-purple-500/20 rounded-xl text-purple-200/80 font-light tracking-wider text-sm md:text-base hover:bg-white/[0.06] transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            CONTINUE AS GUEST
          </motion.button>

          <button
            type="button"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            className="w-full mt-4 text-purple-400/60 text-xs md:text-sm hover:text-purple-300 transition-colors"
          >
            {flow === "signIn" ? "New to the cosmos? Create an account" : "Already have an account? Sign in"}
          </button>
        </motion.div>

        {/* Decorative elements */}
        <div className="flex justify-center mt-8 gap-4 opacity-30">
          <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-300" />
          <Moon className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
          <Star className="w-4 h-4 md:w-5 md:h-5 text-fuchsia-300" />
        </div>
      </motion.div>
    </div>
  );
}
