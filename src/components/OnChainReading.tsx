import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Star, Moon, Sun, ArrowRight, Check, AlertCircle, ExternalLink } from "lucide-react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";

const CONTRACT_ADDRESS = "0xfd2d53b5b47efb3768586515082230130879172b";

// Simple contract ABI for recording readings
const CONTRACT_ABI = [
  "function recordReading(string zodiacSign, string readingType) external payable",
  "function getReadingCount(address user) external view returns (uint256)",
  "function tip() external payable",
];

interface OnChainReadingProps {
  selectedSign: string | null;
}

const READING_TYPES = [
  { id: "birth_chart", name: "Birth Chart", description: "Your cosmic blueprint", icon: Star, cost: "Free (gas only)" },
  { id: "cosmic_alignment", name: "Cosmic Alignment", description: "Current planetary positions", icon: Moon, cost: "Free (gas only)" },
  { id: "destiny_path", name: "Destiny Path", description: "Your life's trajectory", icon: Sun, cost: "Free (gas only)" },
  { id: "lunar_fortune", name: "Lunar Fortune", description: "Moon's influence on your fate", icon: Sparkles, cost: "Free (gas only)" },
];

export function OnChainReading({ selectedSign }: OnChainReadingProps) {
  const createReading = useMutation(api.readings.create);
  const profile = useQuery(api.profiles.get);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "confirm" | "recording" | "complete">("select");

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    checkWallet();
  }, []);

  const recordOnChain = async () => {
    if (!selectedSign || !selectedType || !walletAddress) {
      setError("Please select a zodiac sign and reading type");
      return;
    }

    setIsRecording(true);
    setError(null);
    setStep("recording");

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Simple transaction to record the reading (just sends a minimal transaction for gas purposes)
      // This records the reading on-chain by sending a transaction with data
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: parseEther("0"),
        data: "0x" + Buffer.from(JSON.stringify({
          type: "cosmic_reading",
          sign: selectedSign,
          readingType: selectedType,
          timestamp: Date.now()
        })).toString("hex"),
      });

      setTxHash(tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();

      // Save to Convex
      await createReading({
        walletAddress,
        readingType: selectedType,
        zodiacSign: selectedSign,
        txHash: tx.hash,
        blockNumber: receipt?.blockNumber,
      });

      setStep("complete");
    } catch (err: unknown) {
      const error = err as { message?: string; code?: string };
      console.error("Transaction error:", err);
      if (error.code === "ACTION_REJECTED") {
        setError("Transaction rejected by user");
      } else {
        setError(error.message || "Failed to record reading on-chain");
      }
      setStep("select");
    } finally {
      setIsRecording(false);
    }
  };

  const resetFlow = () => {
    setStep("select");
    setSelectedType(null);
    setTxHash(null);
    setError(null);
  };

  if (!walletAddress) {
    return (
      <div className="max-w-2xl mx-auto backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-6 md:p-8 text-center">
        <AlertCircle className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
        <h3 className="text-xl text-purple-200 mb-2">Wallet Required</h3>
        <p className="text-purple-300/50 text-sm">
          Connect your wallet to record readings on the Base blockchain
        </p>
      </div>
    );
  }

  if (!selectedSign) {
    return (
      <div className="max-w-2xl mx-auto backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-6 md:p-8 text-center">
        <Star className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
        <h3 className="text-xl text-purple-200 mb-2">Select Your Sign</h3>
        <p className="text-purple-300/50 text-sm">
          Choose your zodiac sign in the Daily Horoscope tab first
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-6 md:p-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl text-purple-100 mb-2">Choose Your Reading</h3>
              <p className="text-purple-300/50 text-sm">
                Select a reading type to record on the Base blockchain
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
              {READING_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 border-purple-400/50"
                        : "bg-white/[0.02] border-purple-500/20 hover:border-purple-400/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-purple-500/30" : "bg-white/[0.03]"}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? "text-purple-200" : "text-purple-400/60"}`} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${isSelected ? "text-purple-100" : "text-purple-200/80"}`}>
                          {type.name}
                        </h4>
                        <p className="text-xs text-purple-400/50 mt-0.5">{type.description}</p>
                        <p className="text-xs text-green-400/70 mt-1">{type.cost}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep("confirm")}
                disabled={!selectedType}
                className="flex-1 flex items-center justify-center gap-2 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-6 md:p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600/30 to-fuchsia-600/30 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl md:text-2xl text-purple-100 mb-2">Confirm Recording</h3>
              <p className="text-purple-300/50 text-sm">
                This will record your reading on the Base blockchain
              </p>
            </div>

            <div className="bg-white/[0.02] rounded-xl p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-purple-400/60 text-sm">Zodiac Sign</span>
                <span className="text-purple-200">{selectedSign}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-400/60 text-sm">Reading Type</span>
                <span className="text-purple-200">
                  {READING_TYPES.find(t => t.id === selectedType)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-400/60 text-sm">Network</span>
                <span className="text-purple-200">Base Mainnet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-400/60 text-sm">Cost</span>
                <span className="text-green-300">Gas fees only</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep("select")}
                className="flex-1 py-3 border border-purple-500/30 rounded-xl text-purple-300/70 hover:text-purple-200 transition-colors"
              >
                Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={recordOnChain}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-medium"
              >
                <Zap className="w-4 h-4" />
                Record On-Chain
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "recording" && (
          <motion.div
            key="recording"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-6 md:p-8 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-6"
            >
              <Sparkles className="w-full h-full text-purple-400" />
            </motion.div>
            <h3 className="text-xl text-purple-100 mb-2">Recording Your Reading</h3>
            <p className="text-purple-300/50 text-sm mb-4">
              Please confirm the transaction in your wallet...
            </p>
            {txHash && (
              <p className="text-purple-400/60 text-xs font-mono">
                Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </p>
            )}
          </motion.div>
        )}

        {step === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-6 md:p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-green-400" />
            </motion.div>
            <h3 className="text-xl md:text-2xl text-purple-100 mb-2">Reading Recorded!</h3>
            <p className="text-purple-300/50 text-sm mb-6">
              Your cosmic reading has been permanently inscribed on the Base blockchain
            </p>

            {txHash && (
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 text-sm mb-6 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on BaseScan
              </a>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetFlow}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-medium"
            >
              Record Another Reading
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
