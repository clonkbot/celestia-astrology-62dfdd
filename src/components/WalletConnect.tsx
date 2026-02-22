import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Check, AlertCircle, ChevronDown, ExternalLink } from "lucide-react";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

const BASE_CHAIN_ID = 8453;
const BASE_CHAIN_CONFIG = {
  chainId: "0x2105",
  chainName: "Base",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

export function WalletConnect() {
  const profile = useQuery(api.profiles.get);
  const connectWallet = useMutation(api.profiles.connectWallet);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const checkConnection = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        const chainIdHex = await window.ethereum.request({ method: "eth_chainId" }) as string;
        setChainId(parseInt(chainIdHex, 16));
      }
    } catch (err) {
      console.error("Error checking connection:", err);
    }
  }, []);

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accs = accounts as string[];
        setWalletAddress(accs[0] || null);
      };

      const handleChainChanged = (chainIdHex: unknown) => {
        setChainId(parseInt(chainIdHex as string, 16));
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum?.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [checkConnection]);

  const connect = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask or another Web3 wallet");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[];

      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" }) as string;
      const currentChainId = parseInt(chainIdHex, 16);

      if (currentChainId !== BASE_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: BASE_CHAIN_CONFIG.chainId }],
          });
        } catch (switchError: unknown) {
          const error = switchError as { code?: number };
          if (error.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [BASE_CHAIN_CONFIG],
            });
          } else {
            throw switchError;
          }
        }
      }

      setWalletAddress(accounts[0]);
      setChainId(BASE_CHAIN_ID);

      await connectWallet({
        walletAddress: accounts[0],
        chainId: BASE_CHAIN_ID,
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWalletAddress(null);
    setChainId(null);
    setShowDropdown(false);
  };

  const isOnBase = chainId === BASE_CHAIN_ID;

  if (!walletAddress) {
    return (
      <div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={connect}
          disabled={isConnecting}
          className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white text-sm font-medium tracking-wide disabled:opacity-50 w-full md:w-auto justify-center"
        >
          <Wallet className="w-4 h-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </motion.button>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-xs mt-2 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-sm border transition-colors w-full md:w-auto justify-center ${
          isOnBase
            ? "bg-green-500/10 border-green-500/30 text-green-300"
            : "bg-amber-500/10 border-amber-500/30 text-amber-300"
        }`}
      >
        <div className={`w-2 h-2 rounded-full ${isOnBase ? "bg-green-400" : "bg-amber-400"}`} />
        <span className="font-mono text-xs md:text-sm">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </span>
        <ChevronDown className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 backdrop-blur-xl bg-[#0d0d1a]/95 border border-purple-500/20 rounded-xl shadow-xl z-50"
          >
            <div className="p-4 border-b border-purple-500/10">
              <p className="text-purple-400/60 text-xs mb-1">Connected Wallet</p>
              <p className="text-purple-100 font-mono text-sm break-all">{walletAddress}</p>
            </div>
            <div className="p-4 border-b border-purple-500/10">
              <p className="text-purple-400/60 text-xs mb-1">Network</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnBase ? "bg-green-400" : "bg-amber-400"}`} />
                <span className={isOnBase ? "text-green-300" : "text-amber-300"}>
                  {isOnBase ? "Base Mainnet" : `Chain ${chainId}`}
                </span>
              </div>
            </div>
            <div className="p-2">
              <a
                href={`https://basescan.org/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-purple-300/70 hover:text-purple-200 hover:bg-white/[0.03] rounded-lg text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on BaseScan
              </a>
              <button
                onClick={disconnect}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-400/70 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-sm transition-colors"
              >
                Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
