import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CenterBreathDisplayProps {
  size: number;
  phaseLabel: string;
  timeLeftSeconds: number;
  patternName: string;
  isRunning: boolean;
}

export const CenterBreathDisplay = ({
  size,
  phaseLabel,
  timeLeftSeconds,
  patternName,
  isRunning,
}: CenterBreathDisplayProps) => {
  const [displaySize, setDisplaySize] = useState(size * 0.7);

  useEffect(() => {
    setDisplaySize(size * 0.7);
  }, [size]);

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ width: displaySize, height: displaySize }}
    >
      <motion.div
        key={phaseLabel}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex h-full w-full flex-col items-center justify-center rounded-full border border-white/10 bg-black/30 p-6 text-center text-white backdrop-blur-lg"
      >
        <span className="text-[11px] uppercase tracking-[0.35em] text-white/60">
          Breathwork Studio
        </span>
        <div className="mt-6 text-[26px] font-[Instrument Serif] text-white">
          {phaseLabel}
        </div>
        <div className="mt-3 text-[46px] font-medium tracking-tight text-white">
          {timeLeftSeconds}s
        </div>
        <div className="mt-4 text-[12px] text-white/60">
          {isRunning ? "Shoulders soft. Jaw relaxed." : "Paused. Tap play to resume."}
        </div>
        <div className="mt-3 text-[11px] uppercase tracking-[0.24em] text-white/40">
          {patternName}
        </div>
      </motion.div>
    </div>
  );
};
