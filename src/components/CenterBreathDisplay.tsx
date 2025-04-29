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
      className="breath-display"
      style={{ width: displaySize, height: displaySize }}
    >
      <motion.div
        key={phaseLabel}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="breath-display-inner"
      >
        <div className="breath-phase">
          {phaseLabel}
        </div>
        <div className="breath-time">
          {timeLeftSeconds}s
        </div>
      </motion.div>
    </div>
  );
};
