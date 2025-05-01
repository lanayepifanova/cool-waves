import { useMemo, useState, useEffect } from "react";
import { ShaderCanvas } from "./components/ShaderCanvas";
import { CenterBreathDisplay } from "./components/CenterBreathDisplay";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
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

export default function App() {
  const [canvasSize, setCanvasSize] = useState(600);
  const [selectedPatternId, setSelectedPatternId] = useState(breathPatterns[0].id);
  const [isRunning, setIsRunning] = useState(true);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTimeLeftMs, setPhaseTimeLeftMs] = useState(
    breathPatterns[0].durations.inhale * 1000,
  );
  const [sessionMinutes, setSessionMinutes] = useState(5);
  const [sessionRemainingMs, setSessionRemainingMs] = useState(sessionMinutes * 60 * 1000);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [sessionDraft, setSessionDraft] = useState(String(sessionMinutes));

  const currentPattern = breathPatterns.find(
    (pattern) => pattern.id === selectedPatternId,
  );

  const currentDurations = currentPattern
    ? currentPattern.durations
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
  const smallScale = 0.9;
  const largeScale = 1.08;
  const phaseScaleTargets: Record<BreathPhaseKey, number> = {
    inhale: largeScale,
    hold: largeScale,
    exhale: smallScale,
    rest: smallScale,
  };
  const phaseShaderTargets: Record<BreathPhaseKey, number> = {
    inhale: 1,
    hold: 3,
    exhale: 2,
    rest: 4,
  };
  const phaseTransition = useMemo(() => {
    const inhaleDuration = Math.max(0.01, currentDurations.inhale);
    const holdDuration = Math.max(0.01, currentDurations.hold);
    const exhaleDuration = Math.max(0.01, currentDurations.exhale);
    const restDuration = Math.max(0.01, currentDurations.rest);

    switch (currentPhase.key) {
      case "inhale":
        return { duration: inhaleDuration, ease: [0.2, 0, 0.2, 1] };
      case "hold":
        return { duration: holdDuration, ease: "linear" };
      case "exhale":
        return { duration: exhaleDuration, ease: [0.4, 0, 0.2, 1] };
      case "rest":
        return { duration: restDuration, ease: "linear" };
      default:
        return { duration: 0.2, ease: "linear" };
    }
  }, [currentPhase.key, currentDurations]);

  const formatSessionTime = (remainingMs: number) => {
    const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const startSession = (minutes: number) => {
    setSessionMinutes(minutes);
    setSessionRemainingMs(minutes * 60 * 1000);
    setShowSessionComplete(false);
    setIsRunning(true);
    setPhaseIndex(0);
    setPhaseTimeLeftMs(phases[0].duration * 1000);
  };
  const commitSessionDraft = () => {
    const parsed = Number(sessionDraft);
    if (!Number.isFinite(parsed)) {
      setSessionDraft(String(sessionMinutes));
      setIsEditingSession(false);
      return;
    }
    const clamped = Math.max(1, Math.min(60, Math.round(parsed)));
    setSessionDraft(String(clamped));
    setIsEditingSession(false);
    startSession(clamped);
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
    if (!isEditingSession) {
      setSessionDraft(String(sessionMinutes));
    }
  }, [isEditingSession, sessionMinutes]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setTimeout(() => {
      if (sessionRemainingMs <= 100) {
        setSessionRemainingMs(0);
        setIsRunning(false);
        setShowSessionComplete(true);
        return;
      }

      if (phaseTimeLeftMs <= 100) {
        const nextIndex = (phaseIndex + 1) % phases.length;
        setPhaseIndex(nextIndex);
        setPhaseTimeLeftMs(phases[nextIndex].duration * 1000);
      } else {
        setPhaseTimeLeftMs((prev) => prev - 100);
      }

      setSessionRemainingMs((prev) => Math.max(0, prev - 100));
    }, 100);

    return () => window.clearTimeout(timer);
  }, [isRunning, phaseIndex, phaseTimeLeftMs, phases, sessionRemainingMs]);

  const timeLeftSeconds = Math.max(0, Math.ceil(phaseTimeLeftMs / 1000));
  const phaseScale = phaseScaleTargets[currentPhase.key];
  const phaseShaderId = phaseShaderTargets[currentPhase.key];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
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
            initial={{ scale: smallScale }}
            animate={{ scale: phaseScale }}
            transition={phaseTransition}
            className="relative"
          >
            <ShaderCanvas
              size={canvasSize}
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

      </div>

      <div className="fixed left-0 top-4 z-30 px-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (showSessionComplete || sessionRemainingMs <= 0) {
              startSession(sessionMinutes);
              return;
            }
            setIsRunning((prev) => !prev);
          }}
          className="px-6 py-2 bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 rounded-full h-auto"
        >
          {showSessionComplete ? "Restart" : isRunning ? "Pause" : "Resume"}
        </Button>
      </div>
      <div className="fixed left-1/2 top-4 z-30 -translate-x-1/2 px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditingSession(true)}
          className="h-auto rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 hover:bg-black/70"
        >
          {isEditingSession ? (
            <span className="flex items-center gap-2">
              <span>Session</span>
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                max={60}
                value={sessionDraft}
                onChange={(event) => setSessionDraft(event.target.value)}
                onBlur={commitSessionDraft}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    commitSessionDraft();
                  }
                  if (event.key === "Escape") {
                    setSessionDraft(String(sessionMinutes));
                    setIsEditingSession(false);
                  }
                }}
                className="h-6 w-12 rounded-md border-white/20 bg-white/10 px-2 text-center text-[10px] text-white"
                autoFocus
                aria-label="Session minutes"
              />
              <span>min</span>
            </span>
          ) : (
            <>Session · {formatSessionTime(sessionRemainingMs)}</>
          )}
        </Button>
      </div>
      {showSessionComplete && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex max-w-xs flex-col items-center gap-4 rounded-2xl border border-white/10 bg-black/80 px-6 py-6 text-center text-white shadow-xl">
            <div className="text-lg font-semibold">Session complete</div>
            <div className="text-sm text-white/70">
              Nice work. Take a moment or start another round.
            </div>
            <Button
              size="sm"
              className="rounded-full bg-white px-6 text-black hover:bg-white/90"
              onClick={() => startSession(sessionMinutes)}
            >
              Start again
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
