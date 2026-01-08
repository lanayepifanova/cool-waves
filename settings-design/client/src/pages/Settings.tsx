import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ChevronDown, Clock, Wind, Zap } from "lucide-react";

/**
 * Design Philosophy: Elegant Modernism
 * Meditation App Settings
 * - Deep charcoal background (#0A0A0A) for calm, focused experience
 * - Refined typography: Playfair Display serif for titles, Poppins for body
 * - Soft shadows and subtle borders for depth
 * - Centered layout with breathing room
 * - Collapsible sections for organized information
 * - Smooth, refined interactions
 */

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description?: string;
}

export default function Settings() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["session", "breathing", "animation"])
  );

  // Session timing settings
  const [sessionDuration, setSessionDuration] = useState(10); // minutes
  const [sessionOptions] = useState([5, 10, 15, 20, 30, 45, 60]);

  // Breathing control settings
  const [breathing, setBreathing] = useState({
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 2,
  });

  // Animation speed settings
  const [animationSpeed, setAnimationSpeed] = useState(1); // 0.5x to 2x

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
      icon: <Clock className="w-5 h-5" />,
      description: "Set your meditation session length",
    },
    {
      id: "breathing",
      title: "Breathing Pattern",
      icon: <Wind className="w-5 h-5" />,
      description: "Customize your breathing rhythm",
    },
    {
      id: "animation",
      title: "Animation Speed",
      icon: <Zap className="w-5 h-5" />,
      description: "Adjust background animation pace",
    },
  ];

  const totalBreathCycle = breathing.inhale + breathing.hold + breathing.exhale + breathing.rest;
  const breathsPerMinute = Math.round((60 / totalBreathCycle) * 10) / 10;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F8F8] py-12 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Meditation Settings
        </h1>
        <p className="text-[#999999] text-sm">
          Personalize your meditation experience
        </p>
      </div>

      {/* Settings Sections */}
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Session Duration Section */}
        {sections.map((section) => (
          <div
            key={section.id}
            className="border border-[#2A2A2A] rounded-lg overflow-hidden transition-all duration-300 hover:border-[#3A3A3A]"
            style={{
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#151515] transition-colors duration-200"
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
                    <p className="text-xs text-[#666666] mt-0.5">{section.description}</p>
                  )}
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#999999] transition-transform duration-300 flex-shrink-0 ${
                  expandedSections.has(section.id) ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Section Content */}
            {expandedSections.has(section.id) && (
              <div className="border-t border-[#2A2A2A] bg-[#0D0D0D] p-6 space-y-6">
                {section.id === "session" && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-4">
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
                      <Label className="text-xs font-medium text-[#999999] block mb-3">
                        Quick Select
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {sessionOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => setSessionDuration(option)}
                            className={`py-2 px-3 rounded text-sm font-medium transition-all duration-200 ${
                              sessionDuration === option
                                ? "bg-white text-[#0A0A0A]"
                                : "bg-[#1A1A1A] text-[#F8F8F8] hover:bg-[#252525] border border-[#2A2A2A]"
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
                    <div className="bg-[#151515] rounded p-4 border border-[#2A2A2A]">
                      <p className="text-xs text-[#999999] mb-2">Breath Cycle Information</p>
                      <div className="space-y-1">
                        <p className="text-sm text-[#F8F8F8]">
                          Total cycle: <span className="font-semibold">{totalBreathCycle}s</span>
                        </p>
                        <p className="text-sm text-[#F8F8F8]">
                          Breaths per minute: <span className="font-semibold">{breathsPerMinute}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Inhale */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium text-[#F8F8F8]">
                            Inhale
                          </Label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateBreathing("inhale", breathing.inhale - 1)}
                              className="w-6 h-6 rounded bg-[#1A1A1A] hover:bg-[#252525] text-[#F8F8F8] flex items-center justify-center text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-semibold">{breathing.inhale}s</span>
                            <button
                              onClick={() => updateBreathing("inhale", breathing.inhale + 1)}
                              className="w-6 h-6 rounded bg-[#1A1A1A] hover:bg-[#252525] text-[#F8F8F8] flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <Slider
                          value={[breathing.inhale]}
                          onValueChange={(value) => updateBreathing("inhale", value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Hold */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium text-[#F8F8F8]">
                            Hold
                          </Label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateBreathing("hold", breathing.hold - 1)}
                              className="w-6 h-6 rounded bg-[#1A1A1A] hover:bg-[#252525] text-[#F8F8F8] flex items-center justify-center text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-semibold">{breathing.hold}s</span>
                            <button
                              onClick={() => updateBreathing("hold", breathing.hold + 1)}
                              className="w-6 h-6 rounded bg-[#1A1A1A] hover:bg-[#252525] text-[#F8F8F8] flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <Slider
                          value={[breathing.hold]}
                          onValueChange={(value) => updateBreathing("hold", value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Exhale */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium text-[#F8F8F8]">
                            Exhale
                          </Label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateBreathing("exhale", breathing.exhale - 1)}
                              className="w-6 h-6 rounded bg-[#1A1A1A] hover:bg-[#252525] text-[#F8F8F8] flex items-center justify-center text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-semibold">{breathing.exhale}s</span>
                            <button
                              onClick={() => updateBreathing("exhale", breathing.exhale + 1)}
                              className="w-6 h-6 rounded bg-[#1A1A1A] hover:bg-[#252525] text-[#F8F8F8] flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <Slider
                          value={[breathing.exhale]}
                          onValueChange={(value) => updateBreathing("exhale", value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Rest */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium text-[#F8F8F8]">
                            Rest
                          </Label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateBreathing("rest", breathing.rest - 1)}
                              className="w-6 h-6 rounded bg-[#1A1A1A] hover:bg-[#252525] text-[#F8F8F8] flex items-center justify-center text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-semibold">{breathing.rest}s</span>
                            <button
                              onClick={() => updateBreathing("rest", breathing.rest + 1)}
                              className="w-6 h-6 rounded bg-[#1A1A1A] hover:bg-[#252525] text-[#F8F8F8] flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <Slider
                          value={[breathing.rest]}
                          onValueChange={(value) => updateBreathing("rest", value[0])}
                          min={0}
                          max={5}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Preset Patterns */}
                    <div>
                      <Label className="text-xs font-medium text-[#999999] block mb-3">
                        Preset Patterns
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setBreathing({ inhale: 4, hold: 4, exhale: 4, rest: 2 })}
                          className="py-2 px-3 rounded text-sm font-medium bg-[#1A1A1A] text-[#F8F8F8] hover:bg-[#252525] border border-[#2A2A2A] transition-all duration-200"
                        >
                          Box Breathing
                        </button>
                        <button
                          onClick={() => setBreathing({ inhale: 4, hold: 7, exhale: 8, rest: 0 })}
                          className="py-2 px-3 rounded text-sm font-medium bg-[#1A1A1A] text-[#F8F8F8] hover:bg-[#252525] border border-[#2A2A2A] transition-all duration-200"
                        >
                          4-7-8 Breathing
                        </button>
                        <button
                          onClick={() => setBreathing({ inhale: 5, hold: 0, exhale: 5, rest: 0 })}
                          className="py-2 px-3 rounded text-sm font-medium bg-[#1A1A1A] text-[#F8F8F8] hover:bg-[#252525] border border-[#2A2A2A] transition-all duration-200"
                        >
                          Equal Breathing
                        </button>
                        <button
                          onClick={() => setBreathing({ inhale: 3, hold: 0, exhale: 6, rest: 0 })}
                          className="py-2 px-3 rounded text-sm font-medium bg-[#1A1A1A] text-[#F8F8F8] hover:bg-[#252525] border border-[#2A2A2A] transition-all duration-200"
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
                      <div className="flex items-center justify-between mb-4">
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
                      <div className="flex justify-between text-xs text-[#666666] mt-2">
                        <span>Slower</span>
                        <span>Faster</span>
                      </div>
                    </div>

                    <div className="bg-[#151515] rounded p-4 border border-[#2A2A2A]">
                      <p className="text-xs text-[#999999] mb-2">Preview</p>
                      <div className="flex items-center justify-center py-8">
                        <div
                          className="w-16 h-16 rounded-full border-2 border-white"
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

      {/* Action Buttons */}
      <div className="max-w-2xl mx-auto mt-12 flex gap-4 justify-end">
        <Button
          variant="outline"
          className="border-[#2A2A2A] text-[#F8F8F8] hover:bg-[#1A1A1A] hover:border-[#3A3A3A]"
        >
          Reset to Defaults
        </Button>
        <Button className="bg-white text-[#0A0A0A] hover:bg-[#F0F0F0]">
          Save Settings
        </Button>
      </div>

      {/* CSS for animation */}
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
