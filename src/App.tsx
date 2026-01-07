import { useMemo, useState, useEffect } from "react";
import { ShaderCanvas } from "./components/ShaderCanvas";
import { PatternSelector } from "./components/PatternSelector";
import { CenterBreathDisplay } from "./components/CenterBreathDisplay";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import { Slider } from "./components/ui/slider";
import "./styles/sonner-fixes.css";
import "./styles/input-fixes.css";

type BreathPhaseKey = "inhale" | "hold" | "exhale" | "rest";

interface BreathPattern {
  id: string;
  name: string;
  short: string;
  shaderId: number;
  durations: Record<BreathPhaseKey, number>;
  note: string;
}

const breathPatterns: BreathPattern[] = [
  {
    id: "box",
    name: "Box Breath",
    short: "BOX",
    shaderId: 1,
    durations: { inhale: 4, hold: 4, exhale: 4, rest: 4 },
    note: "Square rhythm for balance and steady focus.",
  },
  {
    id: "478",
    name: "4-7-8 Reset",
    short: "478",
    shaderId: 2,
    durations: { inhale: 4, hold: 7, exhale: 8, rest: 2 },
    note: "Longer exhale to drop the nervous system.",
  },
  {
    id: "ocean",
    name: "Ocean Calm",
    short: "SEA",
    shaderId: 3,
    durations: { inhale: 5, hold: 2, exhale: 6, rest: 2 },
    note: "Soft swell with a gentle pause.",
  },
  {
    id: "spark",
    name: "Spark Focus",
    short: "SPK",
    shaderId: 4,
    durations: { inhale: 3, hold: 2, exhale: 4, rest: 1 },
    note: "Quick cycles to wake up attention.",
  },
];

const defaultDurationsById = breathPatterns.reduce(
  (acc, pattern) => {
    acc[pattern.id] = { ...pattern.durations };
    return acc;
  },
  {} as Record<string, Record<BreathPhaseKey, number>>,
);

export default function App() {
  const [canvasSize, setCanvasSize] = useState(600);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPatternId, setSelectedPatternId] = useState(breathPatterns[0].id);
  const [patternDurations, setPatternDurations] = useState(() => ({
    ...defaultDurationsById,
  }));
  const [isRunning, setIsRunning] = useState(true);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTimeLeftMs, setPhaseTimeLeftMs] = useState(
    breathPatterns[0].durations.inhale * 1000,
  );

  const currentPattern = breathPatterns.find(
    (pattern) => pattern.id === selectedPatternId,
  );

  const currentDurations = currentPattern
    ? patternDurations[currentPattern.id]
    : breathPatterns[0].durations;

  const phases = useMemo(
    () => [
      { key: "inhale" as const, label: "Inhale", duration: currentDurations.inhale },
      { key: "hold" as const, label: "Hold", duration: currentDurations.hold },
      { key: "exhale" as const, label: "Exhale", duration: currentDurations.exhale },
      { key: "rest" as const, label: "Rest", duration: currentDurations.rest },
    ],
    [currentDurations],
  );

  const currentPhase = phases[phaseIndex];
  const phaseScaleTargets: Record<BreathPhaseKey, number> = {
    inhale: 1.08,
    hold: 1.08,
    exhale: 0.92,
    rest: 0.96,
  };

  // Set dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const savedPattern = localStorage.getItem("selectedPattern");
    if (savedPattern && breathPatterns.some((pattern) => pattern.id === savedPattern)) {
      setSelectedPatternId(savedPattern);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedPattern", selectedPatternId);
  }, [selectedPatternId]);

  // Adjust canvas size based on window size
  useEffect(() => {
    const handleResize = () => {
      const size =
        Math.min(window.innerWidth, window.innerHeight) * 0.7;
      setCanvasSize(size);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setPhaseIndex(0);
    setPhaseTimeLeftMs(phases[0].duration * 1000);
  }, [phases]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setTimeout(() => {
      if (phaseTimeLeftMs <= 100) {
        const nextIndex = (phaseIndex + 1) % phases.length;
        setPhaseIndex(nextIndex);
        setPhaseTimeLeftMs(phases[nextIndex].duration * 1000);
      } else {
        setPhaseTimeLeftMs((prev) => prev - 100);
      }
    }, 100);

    return () => window.clearTimeout(timer);
  }, [isRunning, phaseIndex, phaseTimeLeftMs, phases]);

  const timeLeftSeconds = Math.max(0, Math.ceil(phaseTimeLeftMs / 1000));
  const phaseScale = phaseScaleTargets[currentPhase.key];

  const handlePatternSelect = (id: string) => {
    setSelectedPatternId(id);
  };

  const updateDuration = (key: BreathPhaseKey, value: number) => {
    if (!currentPattern) return;
    setPatternDurations((prev) => ({
      ...prev,
      [currentPattern.id]: {
        ...prev[currentPattern.id],
        [key]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative">
      <PatternSelector
        patterns={breathPatterns}
        selectedPatternId={selectedPatternId}
        onSelect={handlePatternSelect}
      />

      {/* Main layout container with shader */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Shader Circle */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{ scale: phaseScale }}
            transition={{ duration: Math.max(0.2, currentPhase.duration), ease: "easeInOut" }}
            className="relative"
          >
            <ShaderCanvas
              size={canvasSize}
              onClick={() => setShowSettings(true)}
              hasActiveReminders={false}
              hasUpcomingReminders={false}
              shaderId={currentPattern?.shaderId ?? 1}
            />

            <CenterBreathDisplay
              size={canvasSize}
              phaseLabel={currentPhase.label}
              timeLeftSeconds={timeLeftSeconds}
              patternName={currentPattern?.name ?? "Breathwork"}
              isRunning={isRunning}
            />
          </motion.div>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
            {currentPattern?.note}
          </span>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRunning((prev) => !prev)}
              className="px-8 py-2 bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 rounded-full h-auto"
            >
              {isRunning ? "Pause" : "Resume"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="px-8 py-2 rounded-full border border-white/20 text-white/80 hover:border-white/40 hover:bg-white/5 h-auto"
            >
              Edit Pattern
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent
          side="bottom"
          className="border-white/10 bg-black/90 text-white backdrop-blur-xl"
        >
          <SheetHeader>
            <SheetTitle className="text-white">Edit Breath Pattern</SheetTitle>
            <SheetDescription className="text-white/60">
              Tune the tempo for {currentPattern?.name ?? "your practice"}.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 px-4 pb-6">
            {phases.map((phase) => (
              <div key={phase.key} className="space-y-3">
                <div className="flex items-center justify-between text-sm text-white">
                  <span>{phase.label}</span>
                  <span className="text-white/60">{currentDurations[phase.key]}s</span>
                </div>
                <Slider
                  value={[currentDurations[phase.key]]}
                  min={0}
                  max={12}
                  step={1}
                  onValueChange={(value) => updateDuration(phase.key, value[0])}
                />
              </div>
            ))}
          </div>
          <SheetFooter className="flex-row items-center justify-between border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!currentPattern) return;
                setPatternDurations((prev) => ({
                  ...prev,
                  [currentPattern.id]: { ...defaultDurationsById[currentPattern.id] },
                }));
              }}
              className="text-white/70 hover:text-white"
            >
              Reset defaults
            </Button>
            <SheetClose asChild>
              <Button
                size="sm"
                className="rounded-full bg-white text-black hover:bg-white/90"
              >
                Done
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
