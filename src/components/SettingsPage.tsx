import { useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown, Clock, Wind, Zap } from "lucide-react";

interface SettingSection {
  id: string;
  title: string;
  icon: ReactNode;
  description?: string;
}

type SettingsPageProps = {
  onClose: () => void;
};

export default function SettingsPage({ onClose }: SettingsPageProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["session", "breathing", "animation"]),
  );

  const [sessionDuration, setSessionDuration] = useState(10);
  const [sessionOptions] = useState([5, 10, 15, 20, 30, 45, 60]);
  const [breathing, setBreathing] = useState({
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 2,
  });
  const [animationSpeed, setAnimationSpeed] = useState(1);

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
    setBreathing((prev) => ({
      ...prev,
      [key]: Math.max(1, value),
    }));
  };

  const sections: SettingSection[] = [
    {
      id: "session",
      title: "Session Duration",
      icon: <Clock size={20} />,
      description: "Set your meditation session length",
    },
    {
      id: "breathing",
      title: "Breathing Pattern",
      icon: <Wind size={20} />,
      description: "Customize your breathing rhythm",
    },
    {
      id: "animation",
      title: "Animation Speed",
      icon: <Zap size={20} />,
      description: "Adjust background animation pace",
    },
  ];

  const totalBreathCycle =
    breathing.inhale + breathing.hold + breathing.exhale + breathing.rest;
  const breathsPerMinute = Math.round((60 / totalBreathCycle) * 10) / 10;

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
                  <div className="settings-card-icon">{section.icon}</div>
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
                          <label className="settings-label">Session Duration</label>
                          <span className="settings-value">
                            {sessionDuration} min
                          </span>
                        </div>
                        <input
                          type="range"
                          className="settings-slider"
                          value={sessionDuration}
                          onChange={(event) =>
                            setSessionDuration(Number(event.target.value))
                          }
                          min={5}
                          max={60}
                          step={5}
                        />
                      </div>

                      <div className="settings-block">
                        <p className="settings-helper">Quick Select</p>
                        <div className="settings-grid settings-grid-4">
                          {sessionOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => setSessionDuration(option)}
                              className={`settings-pill ${
                                sessionDuration === option ? "is-active" : ""
                              }`}
                            >
                              {option}m
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === "breathing" && (
                    <div className="settings-stack">
                      <div className="settings-info-card">
                        <p className="settings-helper">Breath Cycle Information</p>
                        <div className="settings-info">
                          <p>
                            Total cycle:{" "}
                            <span className="settings-info-value">
                              {totalBreathCycle}s
                            </span>
                          </p>
                          <p>
                            Breaths per minute:{" "}
                            <span className="settings-info-value">
                              {breathsPerMinute}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="settings-stack">
                        <div className="settings-stepper">
                          <div className="settings-row">
                            <label className="settings-label">Inhale</label>
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
                            <label className="settings-label">Hold</label>
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
                            <label className="settings-label">Exhale</label>
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
                            <label className="settings-label">Rest</label>
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

                      <div className="settings-block">
                        <p className="settings-helper">Preset Patterns</p>
                        <div className="settings-grid settings-grid-2">
                          <button
                            onClick={() =>
                              setBreathing({ inhale: 4, hold: 4, exhale: 4, rest: 2 })
                            }
                            className="settings-pill"
                          >
                            Box Breathing
                          </button>
                          <button
                            onClick={() =>
                              setBreathing({ inhale: 4, hold: 7, exhale: 8, rest: 0 })
                            }
                            className="settings-pill"
                          >
                            4-7-8 Breathing
                          </button>
                          <button
                            onClick={() =>
                              setBreathing({ inhale: 5, hold: 0, exhale: 5, rest: 0 })
                            }
                            className="settings-pill"
                          >
                            Equal Breathing
                          </button>
                          <button
                            onClick={() =>
                              setBreathing({ inhale: 3, hold: 0, exhale: 6, rest: 0 })
                            }
                            className="settings-pill"
                          >
                            Relaxing Breath
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === "animation" && (
                    <div className="settings-stack">
                      <div className="settings-block">
                        <div className="settings-row">
                          <label className="settings-label">Animation Speed</label>
                          <span className="settings-value">
                            {animationSpeed.toFixed(1)}x
                          </span>
                        </div>
                        <input
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

                      <div className="settings-preview-card">
                        <p className="settings-helper">Preview</p>
                        <div className="settings-preview">
                          <div
                            className="settings-spinner"
                            style={{
                              animation: `spin ${4 / animationSpeed}s linear infinite`,
                            }}
                          />
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
          <button className="settings-action settings-action-outline">
            Reset to Defaults
          </button>
          <button className="settings-action settings-action-primary">
            Save Settings
          </button>
        </div>
      </div>

    </div>
  );
}
