import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CenterBreathDisplayProps {
  size: number;
  phaseLabel: string;
  timeLeftSeconds: number;
  patternName: string;
}

export const CenterBreathDisplay = ({
  size,
  phaseLabel,
  timeLeftSeconds,
  patternName,
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
        className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-white"
      >
        <div className="text-[26px] font-[Instrument Serif] font-bold text-white">
          {phaseLabel}
        </div>
        <div className="mt-3 text-[46px] font-bold tracking-tight text-white">
          {timeLeftSeconds}s
        </div>
      </motion.div>
    </div>
  );
};
