import { useMemo, useState, useEffect } from "react";
import { ShaderCanvas } from "./components/ShaderCanvas";
import { CenterBreathDisplay } from "./components/CenterBreathDisplay";
import { motion } from "framer-motion";
import SettingsPage from "./components/SettingsPage";
import {
  DEFAULT_SETTINGS,
  breathingLimits,
  type BreathPhaseKey,
} from "./data/breathing";

const SETTINGS_STORAGE_KEY = "meditationSettings";

export default function App() {
  const [canvasSize, setCanvasSize] = useState(600);
  const [isRunning, setIsRunning] = useState(true);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTimeLeftMs, setPhaseTimeLeftMs] = useState(
    DEFAULT_SETTINGS.breathing.inhale * 1000,
  );
  const [sessionDurationSeconds, setSessionDurationSeconds] = useState(
    DEFAULT_SETTINGS.sessionDurationSeconds,
  );
  const [sessionRemainingMs, setSessionRemainingMs] = useState(
    DEFAULT_SETTINGS.sessionDurationSeconds * 1000,
  );
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [breathingDurations, setBreathingDurations] = useState(
    DEFAULT_SETTINGS.breathing,
  );
  const [animationSpeed, setAnimationSpeed] = useState(
    DEFAULT_SETTINGS.animationSpeed,
  );
  const [settingsSnapshot, setSettingsSnapshot] = useState<string | null>(null);
  const shaderSpeed = 0.2 * animationSpeed;

  const currentDurations = breathingDurations;

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

  const startSession = (durationSeconds: number) => {
    setSessionDurationSeconds(durationSeconds);
    setSessionRemainingMs(durationSeconds * 1000);
    setShowSessionComplete(false);
    setIsRunning(true);
    setPhaseIndex(0);
    setPhaseTimeLeftMs(phases[0].duration * 1000);
  };

  // Set dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const applySettings = (settings: typeof DEFAULT_SETTINGS, snapshot: string | null) => {
    const clamp = (key: BreathPhaseKey, value: number) => {
      const limits = breathingLimits[key];
      return Math.min(limits.max, Math.max(limits.min, value));
    };
    setSessionDurationSeconds(settings.sessionDurationSeconds);
    setSessionRemainingMs(settings.sessionDurationSeconds * 1000);
    setBreathingDurations({
      inhale: clamp("inhale", settings.breathing.inhale),
      hold: clamp("hold", settings.breathing.hold),
      exhale: clamp("exhale", settings.breathing.exhale),
      rest: clamp("rest", settings.breathing.rest),
    });
    setAnimationSpeed(settings.animationSpeed);
    setShowSessionComplete(false);
    setSettingsSnapshot(snapshot);
  };

  const readSettings = () => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!storedSettings) {
      if (settingsSnapshot !== "__default__") {
        applySettings(DEFAULT_SETTINGS, "__default__");
      }
      return;
    }
    if (storedSettings === settingsSnapshot) {
      return;
    }
    try {
      const parsed = JSON.parse(storedSettings) as Partial<typeof DEFAULT_SETTINGS>;
      const normalized = {
        sessionDurationSeconds:
          typeof parsed.sessionDurationSeconds === "number"
            ? parsed.sessionDurationSeconds
            : DEFAULT_SETTINGS.sessionDurationSeconds,
        breathing: {
          inhale:
            typeof parsed.breathing?.inhale === "number"
              ? parsed.breathing.inhale
              : DEFAULT_SETTINGS.breathing.inhale,
          hold:
            typeof parsed.breathing?.hold === "number"
              ? parsed.breathing.hold
              : DEFAULT_SETTINGS.breathing.hold,
          exhale:
            typeof parsed.breathing?.exhale === "number"
              ? parsed.breathing.exhale
              : DEFAULT_SETTINGS.breathing.exhale,
          rest:
            typeof parsed.breathing?.rest === "number"
              ? parsed.breathing.rest
              : DEFAULT_SETTINGS.breathing.rest,
        },
        animationSpeed:
          typeof parsed.animationSpeed === "number"
            ? parsed.animationSpeed
            : DEFAULT_SETTINGS.animationSpeed,
      };
      applySettings(normalized, storedSettings);
    } catch {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      applySettings(DEFAULT_SETTINGS, "__default__");
    }
  };

  useEffect(() => {
    readSettings();
  }, []);

  useEffect(() => {
    if (!showSettings) {
      readSettings();
    }
  }, [showSettings]);

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
  if (showSettings) {
    return <SettingsPage onClose={() => setShowSettings(false)} />;
  }

  return (
    <div className="app-root">
      <div className="app-stage">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="app-stage-inner"
        >
          <motion.div
            initial={{ scale: smallScale }}
            animate={{ scale: phaseScale }}
            transition={phaseTransition}
            className="app-canvas-wrap"
          >
            <ShaderCanvas
              size={canvasSize}
              hasActiveReminders={false}
              hasUpcomingReminders={false}
              shaderId={phaseShaderId}
              timeScale={shaderSpeed}
            />

            <CenterBreathDisplay
              size={canvasSize}
              phaseLabel={currentPhase.label}
              timeLeftSeconds={timeLeftSeconds}
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="app-session-badge">
        <div className="app-session-pill">
          Session · {formatSessionTime(sessionRemainingMs)}
        </div>
      </div>
      <div className="app-settings">
        <button
          className="app-settings-button"
          onClick={() => setShowSettings(true)}
          aria-label="Open settings"
        >
          Settings
        </button>
      </div>
      {showSessionComplete && (
        <div className="app-overlay">
          <div className="app-modal">
            <div className="app-modal-title">Session complete</div>
            <div className="app-modal-text">
              Nice work. Take a moment or start another round.
            </div>
            <button
              className="app-primary-button"
              onClick={() => startSession(sessionDurationSeconds)}
            >
              Start again
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
