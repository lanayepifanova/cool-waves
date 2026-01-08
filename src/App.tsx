import { useMemo, useState, useEffect } from "react";
import { ShaderCanvas } from "./components/ShaderCanvas";
import { CenterBreathDisplay } from "./components/CenterBreathDisplay";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
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
  const phaseShaderTargets: Record<BreathPhaseKey, number> = {
    inhale: 1,
    hold: 3,
    exhale: 2,
    rest: 4,
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
  const phaseShaderId = phaseShaderTargets[currentPhase.key];

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

  const handleDurationInput = (key: BreathPhaseKey, rawValue: string) => {
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) return;
    const clamped = Math.max(0, Math.min(12, Math.round(parsed)));
    updateDuration(key, clamped);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative">
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
            transition={{ type: "spring", damping: 22, stiffness: 120, mass: 0.6 }}
            className="relative"
          >
            <ShaderCanvas
              size={canvasSize}
              onClick={() => setShowSettings(true)}
              hasActiveReminders={false}
              hasUpcomingReminders={false}
              shaderId={phaseShaderId}
            />

            <CenterBreathDisplay
              size={canvasSize}
              phaseLabel={currentPhase.label}
              timeLeftSeconds={timeLeftSeconds}
              patternName={currentPattern?.name ?? "Breathwork"}
            />
          </motion.div>
        </motion.div>

      <div className="fixed left-4 top-4 z-20">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
          {currentPattern?.name ?? "Breathwork"}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsRunning((prev) => !prev)}
          className="px-6 py-2 bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 rounded-full h-auto"
        >
          {isRunning ? "Pause" : "Resume"}
        </Button>
      </div>
      <div className="fixed right-4 top-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="px-6 py-2 rounded-full border border-white/20 text-white/80 hover:border-white/40 hover:bg-white/5 h-auto"
        >
          Edit Pattern
        </Button>
      </div>
      </div>

      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent
          side="right"
          className="top-4 bottom-auto right-4 h-auto max-h-[90vh] w-[min(92vw,360px)] rounded-2xl border border-white/10 bg-black/90 text-white backdrop-blur-xl"
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
                  <div className="flex items-center gap-2 text-white/60">
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={12}
                      step={1}
                      value={currentDurations[phase.key]}
                      onChange={(event) =>
                        handleDurationInput(phase.key, event.target.value)
                      }
                      className="h-8 w-14 rounded-lg border-white/20 bg-white/5 text-right text-white"
                      aria-label={`${phase.label} seconds`}
                    />
                    <span>seconds</span>
                  </div>
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
