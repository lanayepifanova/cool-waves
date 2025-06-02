import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import {
  DEFAULT_SETTINGS,
  breathPatterns,
  breathingLimits,
} from "../data/breathing";

interface SettingSection {
  id: string;
  title: string;
  icon: ReactNode | null;
  description?: string;
}

type SettingsPageProps = {
  onClose: () => void;
};

const SETTINGS_STORAGE_KEY = "meditationSettings";

export default function SettingsPage({ onClose }: SettingsPageProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["session", "breathing", "animation"]),
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  const [sessionDurationSeconds, setSessionDurationSeconds] = useState(
    DEFAULT_SETTINGS.sessionDurationSeconds,
  );
  const [breathing, setBreathing] = useState(DEFAULT_SETTINGS.breathing);
  const [animationSpeed, setAnimationSpeed] = useState(
    DEFAULT_SETTINGS.animationSpeed,
  );

  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!storedSettings) return;
    try {
      const parsed = JSON.parse(storedSettings) as Partial<typeof DEFAULT_SETTINGS>;
      if (typeof parsed.sessionDurationSeconds === "number") {
        setSessionDurationSeconds(parsed.sessionDurationSeconds);
      }
      if (typeof parsed.animationSpeed === "number") {
        setAnimationSpeed(parsed.animationSpeed);
      }
      if (parsed.breathing) {
        setBreathing((prev) => ({
          inhale:
            typeof parsed.breathing?.inhale === "number"
              ? parsed.breathing.inhale
              : prev.inhale,
          hold:
            typeof parsed.breathing?.hold === "number"
              ? parsed.breathing.hold
              : prev.hold,
          exhale:
            typeof parsed.breathing?.exhale === "number"
              ? parsed.breathing.exhale
              : prev.exhale,
          rest:
            typeof parsed.breathing?.rest === "number"
              ? parsed.breathing.rest
              : prev.rest,
        }));
      }
    } catch {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }
  }, []);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const updateBreathing = (key: keyof typeof breathing, value: number) => {
    const limits = breathingLimits[key];
    setBreathing((prev) => ({
      ...prev,
      [key]: Math.min(limits.max, Math.max(limits.min, value)),
    }));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const sections: SettingSection[] = [
    {
      id: "session",
      title: "Session Duration",
      icon: null,
      description: "Set your meditation session length",
    },
    {
      id: "breathing",
      title: "Breathing Pattern",
      icon: null,
      description: "Customize your breathing rhythm",
    },
    {
      id: "animation",
      title: "Animation Speed",
      icon: null,
      description: "Adjust background animation pace",
    },
  ];

  const handleSaveSettings = () => {
    const payload = {
      sessionDurationSeconds,
      breathing,
      animationSpeed,
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    setSaveStatus("saved");
    window.setTimeout(() => {
      setSaveStatus("idle");
    }, 1500);
  };

  const handleResetDefaults = () => {
    setSessionDurationSeconds(DEFAULT_SETTINGS.sessionDurationSeconds);
    setBreathing(DEFAULT_SETTINGS.breathing);
    setAnimationSpeed(DEFAULT_SETTINGS.animationSpeed);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <button className="settings-back-button" onClick={onClose}>
            <ArrowLeft className="settings-back-icon" />
            Back
          </button>
        </div>

        <div className="settings-title-block">
          <h1 className="settings-title">Meditation Settings</h1>
          <p className="settings-subtitle">
            Personalize your meditation experience
          </p>
        </div>

        <div className="settings-list">
          {sections.map((section) => (
            <div key={section.id} className="settings-card">
              <button
                onClick={() => toggleSection(section.id)}
                className="settings-card-toggle"
              >
                <div className="settings-card-title-wrap">
                  <div className="settings-card-text">
                    <h2 className="settings-card-title">{section.title}</h2>
                    {section.description && (
                      <p className="settings-card-desc">{section.description}</p>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={`settings-chevron ${
                    expandedSections.has(section.id) ? "is-expanded" : ""
                  }`}
                />
              </button>

              {expandedSections.has(section.id) && (
                <div className="settings-card-content">
                  {section.id === "session" && (
                    <div className="settings-stack">
                      <div className="settings-block">
                        <div className="settings-row">
                          <label className="settings-label" htmlFor="session-duration">
                            Session Duration
                          </label>
                          <span className="settings-value">
                            {formatDuration(sessionDurationSeconds)}
                          </span>
                        </div>
                        <input
                          id="session-duration"
                          type="range"
                          className="settings-slider"
                          value={sessionDurationSeconds}
                          onChange={(event) =>
                            setSessionDurationSeconds(Number(event.target.value))
                          }
                          min={0}
                          max={600}
                          step={15}
                        />
                      </div>
                    </div>
                  )}

                  {section.id === "breathing" && (
                    <div className="settings-stack">
                      <div className="settings-block">
                        <p className="settings-helper">Preset Patterns</p>
                        <div className="settings-grid settings-grid-2">
                          {breathPatterns.map((pattern) => (
                            <button
                              key={pattern.id}
                              onClick={() => setBreathing(pattern.durations)}
                              className="settings-pill"
                            >
                              {pattern.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="settings-stack">
                        <div className="settings-stepper">
                          <div className="settings-row">
                            <label className="settings-label" htmlFor="breath-inhale">
                              Inhale
                            </label>
                            <div className="settings-stepper-controls">
                              <button
                                className="settings-stepper-button"
                                onClick={() =>
                                  updateBreathing("inhale", breathing.inhale - 1)
                                }
                              >
                                -
                              </button>
                              <span className="settings-stepper-value">
                                {breathing.inhale}s
                              </span>
                              <button
                                className="settings-stepper-button"
                                onClick={() =>
                                  updateBreathing("inhale", breathing.inhale + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <input
                            id="breath-inhale"
                            type="range"
                            className="settings-slider"
                            value={breathing.inhale}
                            onChange={(event) =>
                              updateBreathing("inhale", Number(event.target.value))
                            }
                            min={1}
                            max={10}
                            step={1}
                          />
                        </div>

                        <div className="settings-stepper">
                          <div className="settings-row">
                            <label className="settings-label" htmlFor="breath-hold">
                              Hold
                            </label>
                            <div className="settings-stepper-controls">
                              <button
                                className="settings-stepper-button"
                                onClick={() =>
                                  updateBreathing("hold", breathing.hold - 1)
                                }
                              >
                                -
                              </button>
                              <span className="settings-stepper-value">
                                {breathing.hold}s
                              </span>
                              <button
                                className="settings-stepper-button"
                                onClick={() =>
                                  updateBreathing("hold", breathing.hold + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <input
                            id="breath-hold"
                            type="range"
                            className="settings-slider"
                            value={breathing.hold}
                            onChange={(event) =>
                              updateBreathing("hold", Number(event.target.value))
                            }
                            min={1}
                            max={10}
                            step={1}
                          />
                        </div>

                        <div className="settings-stepper">
                          <div className="settings-row">
                            <label className="settings-label" htmlFor="breath-exhale">
                              Exhale
                            </label>
                            <div className="settings-stepper-controls">
                              <button
                                className="settings-stepper-button"
                                onClick={() =>
                                  updateBreathing("exhale", breathing.exhale - 1)
                                }
                              >
                                -
                              </button>
                              <span className="settings-stepper-value">
                                {breathing.exhale}s
                              </span>
                              <button
                                className="settings-stepper-button"
                                onClick={() =>
                                  updateBreathing("exhale", breathing.exhale + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <input
                            id="breath-exhale"
                            type="range"
                            className="settings-slider"
                            value={breathing.exhale}
                            onChange={(event) =>
                              updateBreathing("exhale", Number(event.target.value))
                            }
                            min={1}
                            max={10}
                            step={1}
                          />
                        </div>

                        <div className="settings-stepper">
                          <div className="settings-row">
                            <label className="settings-label" htmlFor="breath-rest">
                              Rest
                            </label>
                            <div className="settings-stepper-controls">
                              <button
                                className="settings-stepper-button"
                                onClick={() =>
                                  updateBreathing("rest", breathing.rest - 1)
                                }
                              >
                                -
                              </button>
                              <span className="settings-stepper-value">
                                {breathing.rest}s
                              </span>
                              <button
                                className="settings-stepper-button"
                                onClick={() =>
                                  updateBreathing("rest", breathing.rest + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <input
                            id="breath-rest"
                            type="range"
                            className="settings-slider"
                            value={breathing.rest}
                            onChange={(event) =>
                              updateBreathing("rest", Number(event.target.value))
                            }
                            min={0}
                            max={5}
                            step={1}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === "animation" && (
                    <div className="settings-stack">
                      <div className="settings-block">
                        <div className="settings-row">
                          <label className="settings-label" htmlFor="animation-speed">
                            Animation Speed
                          </label>
                          <span className="settings-value">
                            {animationSpeed.toFixed(1)}x
                          </span>
                        </div>
                        <input
                          id="animation-speed"
                          type="range"
                          className="settings-slider"
                          value={animationSpeed}
                          onChange={(event) =>
                            setAnimationSpeed(Number(event.target.value))
                          }
                          min={0.5}
                          max={2}
                          step={0.1}
                        />
                        <div className="settings-scale">
                          <span>Slower</span>
                          <span>Faster</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="settings-actions">
          <button
            className="settings-action settings-action-outline"
            onClick={handleResetDefaults}
          >
            Reset to Defaults
          </button>
          <button
            className="settings-action settings-action-primary"
            onClick={handleSaveSettings}
          >
            {saveStatus === "saved" ? "Saved" : "Save Settings"}
          </button>
        </div>
      </div>

    </div>
  );
}
