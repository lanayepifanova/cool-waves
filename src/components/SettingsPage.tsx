import { useState, type ReactNode } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
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
      icon: <Clock className="h-5 w-5" />,
      description: "Set your meditation session length",
    },
    {
      id: "breathing",
      title: "Breathing Pattern",
      icon: <Wind className="h-5 w-5" />,
      description: "Customize your breathing rhythm",
    },
    {
      id: "animation",
      title: "Animation Speed",
      icon: <Zap className="h-5 w-5" />,
      description: "Adjust background animation pace",
    },
  ];

  const totalBreathCycle =
    breathing.inhale + breathing.hold + breathing.exhale + breathing.rest;
  const breathsPerMinute = Math.round((60 / totalBreathCycle) * 10) / 10;

  return (
    <div
      className="min-h-screen bg-[#0A0A0A] px-4 py-12 text-[#F8F8F8]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="mx-auto mb-8 flex max-w-2xl items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-xs uppercase tracking-[0.2em] text-[#F8F8F8] hover:bg-[#1A1A1A]"
          onClick={onClose}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>
      </div>

      <div className="mx-auto mb-12 max-w-2xl">
        <h1
          className="mb-2 text-4xl font-bold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Meditation Settings
        </h1>
        <p className="text-sm text-[#999999]">
          Personalize your meditation experience
        </p>
      </div>

      <div className="mx-auto space-y-4 max-w-2xl">
        {sections.map((section) => (
          <div
            key={section.id}
            className="overflow-hidden rounded-lg border border-[#2A2A2A] transition-all duration-300 hover:border-[#3A3A3A]"
            style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)" }}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors duration-200 hover:bg-[#151515]"
            >
              <div className="flex items-center gap-3">
                <div className="text-[#999999]">{section.icon}</div>
                <div className="text-left">
                  <h2
                    className="text-lg font-semibold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="mt-0.5 text-xs text-[#666666]">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 text-[#999999] transition-transform duration-300 ${
                  expandedSections.has(section.id) ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedSections.has(section.id) && (
              <div className="space-y-6 border-t border-[#2A2A2A] bg-[#0D0D0D] p-6">
                {section.id === "session" && (
                  <div className="space-y-4">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <Label className="text-sm font-medium text-[#F8F8F8]">
                          Session Duration
                        </Label>
                        <span className="text-lg font-semibold text-white">
                          {sessionDuration} min
                        </span>
                      </div>
                      <Slider
                        value={[sessionDuration]}
                        onValueChange={(value) => setSessionDuration(value[0])}
                        min={5}
                        max={60}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label className="mb-3 block text-xs font-medium text-[#999999]">
                        Quick Select
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {sessionOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => setSessionDuration(option)}
                            className={`rounded px-3 py-2 text-sm font-medium transition-all duration-200 ${
                              sessionDuration === option
                                ? "bg-white text-[#0A0A0A]"
                                : "border border-[#2A2A2A] bg-[#1A1A1A] text-[#F8F8F8] hover:bg-[#252525]"
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
                  <div className="space-y-6">
                    <div className="rounded border border-[#2A2A2A] bg-[#151515] p-4">
                      <p className="mb-2 text-xs text-[#999999]">
                        Breath Cycle Information
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-[#F8F8F8]">
                          Total cycle:{" "}
                          <span className="font-semibold">
                            {totalBreathCycle}s
                          </span>
                        </p>
                        <p className="text-sm text-[#F8F8F8]">
                          Breaths per minute:{" "}
                          <span className="font-semibold">{breathsPerMinute}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <Label className="text-sm font-medium text-[#F8F8F8]">
                            Inhale
                          </Label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateBreathing("inhale", breathing.inhale - 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded bg-[#1A1A1A] text-sm text-[#F8F8F8] hover:bg-[#252525]"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {breathing.inhale}s
                            </span>
                            <button
                              onClick={() =>
                                updateBreathing("inhale", breathing.inhale + 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded bg-[#1A1A1A] text-sm text-[#F8F8F8] hover:bg-[#252525]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <Slider
                          value={[breathing.inhale]}
                          onValueChange={(value) =>
                            updateBreathing("inhale", value[0])
                          }
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <Label className="text-sm font-medium text-[#F8F8F8]">
                            Hold
                          </Label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateBreathing("hold", breathing.hold - 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded bg-[#1A1A1A] text-sm text-[#F8F8F8] hover:bg-[#252525]"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {breathing.hold}s
                            </span>
                            <button
                              onClick={() =>
                                updateBreathing("hold", breathing.hold + 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded bg-[#1A1A1A] text-sm text-[#F8F8F8] hover:bg-[#252525]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <Slider
                          value={[breathing.hold]}
                          onValueChange={(value) =>
                            updateBreathing("hold", value[0])
                          }
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <Label className="text-sm font-medium text-[#F8F8F8]">
                            Exhale
                          </Label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateBreathing("exhale", breathing.exhale - 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded bg-[#1A1A1A] text-sm text-[#F8F8F8] hover:bg-[#252525]"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {breathing.exhale}s
                            </span>
                            <button
                              onClick={() =>
                                updateBreathing("exhale", breathing.exhale + 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded bg-[#1A1A1A] text-sm text-[#F8F8F8] hover:bg-[#252525]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <Slider
                          value={[breathing.exhale]}
                          onValueChange={(value) =>
                            updateBreathing("exhale", value[0])
                          }
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <Label className="text-sm font-medium text-[#F8F8F8]">
                            Rest
                          </Label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateBreathing("rest", breathing.rest - 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded bg-[#1A1A1A] text-sm text-[#F8F8F8] hover:bg-[#252525]"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {breathing.rest}s
                            </span>
                            <button
                              onClick={() =>
                                updateBreathing("rest", breathing.rest + 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded bg-[#1A1A1A] text-sm text-[#F8F8F8] hover:bg-[#252525]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <Slider
                          value={[breathing.rest]}
                          onValueChange={(value) =>
                            updateBreathing("rest", value[0])
                          }
                          min={0}
                          max={5}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block text-xs font-medium text-[#999999]">
                        Preset Patterns
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            setBreathing({ inhale: 4, hold: 4, exhale: 4, rest: 2 })
                          }
                          className="rounded border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm font-medium text-[#F8F8F8] transition-all duration-200 hover:bg-[#252525]"
                        >
                          Box Breathing
                        </button>
                        <button
                          onClick={() =>
                            setBreathing({ inhale: 4, hold: 7, exhale: 8, rest: 0 })
                          }
                          className="rounded border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm font-medium text-[#F8F8F8] transition-all duration-200 hover:bg-[#252525]"
                        >
                          4-7-8 Breathing
                        </button>
                        <button
                          onClick={() =>
                            setBreathing({ inhale: 5, hold: 0, exhale: 5, rest: 0 })
                          }
                          className="rounded border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm font-medium text-[#F8F8F8] transition-all duration-200 hover:bg-[#252525]"
                        >
                          Equal Breathing
                        </button>
                        <button
                          onClick={() =>
                            setBreathing({ inhale: 3, hold: 0, exhale: 6, rest: 0 })
                          }
                          className="rounded border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm font-medium text-[#F8F8F8] transition-all duration-200 hover:bg-[#252525]"
                        >
                          Relaxing Breath
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {section.id === "animation" && (
                  <div className="space-y-4">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <Label className="text-sm font-medium text-[#F8F8F8]">
                          Animation Speed
                        </Label>
                        <span className="text-lg font-semibold text-white">
                          {animationSpeed.toFixed(1)}x
                        </span>
                      </div>
                      <Slider
                        value={[animationSpeed]}
                        onValueChange={(value) => setAnimationSpeed(value[0])}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="mt-2 flex justify-between text-xs text-[#666666]">
                        <span>Slower</span>
                        <span>Faster</span>
                      </div>
                    </div>

                    <div className="rounded border border-[#2A2A2A] bg-[#151515] p-4">
                      <p className="mb-2 text-xs text-[#999999]">Preview</p>
                      <div className="flex items-center justify-center py-8">
                        <div
                          className="h-16 w-16 rounded-full border-2 border-white"
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

      <div className="mx-auto mt-12 flex max-w-2xl justify-end gap-4">
        <Button
          variant="outline"
          className="border-[#2A2A2A] text-[#F8F8F8] hover:border-[#3A3A3A] hover:bg-[#1A1A1A]"
        >
          Reset to Defaults
        </Button>
        <Button className="bg-white text-[#0A0A0A] hover:bg-[#F0F0F0]">
          Save Settings
        </Button>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
