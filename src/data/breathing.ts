export type BreathPhaseKey = "inhale" | "hold" | "exhale" | "rest";

export interface BreathPattern {
  id: string;
  name: string;
  short: string;
  shaderId: number;
  durations: Record<BreathPhaseKey, number>;
  note: string;
}

export const DEFAULT_SETTINGS = {
  sessionDurationSeconds: 600,
  breathing: {
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 2,
  },
  animationSpeed: 1,
};

export const breathingLimits: Record<
  BreathPhaseKey,
  { min: number; max: number }
> = {
  inhale: { min: 1, max: 10 },
  hold: { min: 1, max: 10 },
  exhale: { min: 1, max: 10 },
  rest: { min: 0, max: 5 },
};

export const breathPatterns: BreathPattern[] = [
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
