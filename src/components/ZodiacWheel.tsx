import { motion } from "framer-motion";

const ZODIAC_SIGNS: { name: string; symbol: string; element: Element }[] = [
  { name: "Aries", symbol: "♈", element: "fire" },
  { name: "Taurus", symbol: "♉", element: "earth" },
  { name: "Gemini", symbol: "♊", element: "air" },
  { name: "Cancer", symbol: "♋", element: "water" },
  { name: "Leo", symbol: "♌", element: "fire" },
  { name: "Virgo", symbol: "♍", element: "earth" },
  { name: "Libra", symbol: "♎", element: "air" },
  { name: "Scorpio", symbol: "♏", element: "water" },
  { name: "Sagittarius", symbol: "♐", element: "fire" },
  { name: "Capricorn", symbol: "♑", element: "earth" },
  { name: "Aquarius", symbol: "♒", element: "air" },
  { name: "Pisces", symbol: "♓", element: "water" },
];

type Element = "fire" | "earth" | "air" | "water";

const elementColors: Record<Element, string> = {
  fire: "from-orange-500/80 to-red-500/80",
  earth: "from-emerald-500/80 to-green-600/80",
  air: "from-sky-400/80 to-blue-500/80",
  water: "from-blue-500/80 to-purple-600/80",
};

interface ZodiacWheelProps {
  selectedSign: string | null;
  onSelectSign: (sign: string) => void;
}

export function ZodiacWheel({ selectedSign, onSelectSign }: ZodiacWheelProps) {
  return (
    <div className="backdrop-blur-xl bg-white/[0.02] border border-purple-500/20 rounded-2xl p-4 md:p-8">
      <h3 className="text-center text-purple-200/80 text-sm tracking-[0.2em] mb-6">SELECT YOUR SIGN</h3>

      {/* Wheel for larger screens */}
      <div className="hidden md:block relative w-full aspect-square max-w-[400px] mx-auto">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute inset-8 border border-purple-500/10 rounded-full"
        />
        <div className="absolute inset-16 border border-purple-500/5 rounded-full" />

        {ZODIAC_SIGNS.map((sign, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const radius = 42;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          const isSelected = selectedSign === sign.name;

          return (
            <motion.button
              key={sign.name}
              onClick={() => onSelectSign(sign.name)}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSelected
                  ? `bg-gradient-to-br ${elementColors[sign.element]} shadow-lg shadow-purple-500/30`
                  : "bg-white/[0.03] border border-purple-500/20 hover:bg-white/[0.08]"
              }`}
            >
              <span className={`text-xl md:text-2xl ${isSelected ? "text-white" : "text-purple-300/70"}`}>
                {sign.symbol}
              </span>
            </motion.button>
          );
        })}

        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.div
            key={selectedSign}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-600/30 to-fuchsia-600/30 border border-purple-500/30 flex items-center justify-center"
          >
            {selectedSign ? (
              <div>
                <div className="text-2xl md:text-3xl mb-1">
                  {ZODIAC_SIGNS.find((s) => s.name === selectedSign)?.symbol}
                </div>
                <div className="text-[10px] text-purple-300/60 tracking-wider">{selectedSign}</div>
              </div>
            ) : (
              <span className="text-purple-400/40 text-xs">TAP</span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Grid for mobile */}
      <div className="md:hidden grid grid-cols-4 gap-2">
        {ZODIAC_SIGNS.map((sign) => {
          const isSelected = selectedSign === sign.name;
          return (
            <motion.button
              key={sign.name}
              onClick={() => onSelectSign(sign.name)}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? `bg-gradient-to-br ${elementColors[sign.element]} shadow-lg`
                  : "bg-white/[0.03] border border-purple-500/20"
              }`}
            >
              <span className={`text-xl ${isSelected ? "text-white" : "text-purple-300/70"}`}>
                {sign.symbol}
              </span>
              <span className={`text-[8px] mt-1 ${isSelected ? "text-white/80" : "text-purple-400/50"}`}>
                {sign.name.slice(0, 3)}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Element Legend */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-6">
        {(["fire", "earth", "air", "water"] as Element[]).map((element) => (
          <div key={element} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${elementColors[element]}`} />
            <span className="text-[10px] md:text-xs text-purple-300/40 capitalize">{element}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
