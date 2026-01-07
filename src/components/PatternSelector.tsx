import { cn } from "./ui/utils";

interface PatternItem {
  id: string;
  name: string;
  short: string;
}

interface PatternSelectorProps {
  patterns: PatternItem[];
  selectedPatternId: string;
  onSelect: (id: string) => void;
}

export const PatternSelector = ({
  patterns,
  selectedPatternId,
  onSelect,
}: PatternSelectorProps) => {
  return (
    <div className="fixed right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
      {patterns.map((pattern) => {
        const isSelected = selectedPatternId === pattern.id;

        return (
          <button
            key={pattern.id}
            type="button"
            onClick={() => onSelect(pattern.id)}
            aria-pressed={isSelected}
            aria-label={pattern.name}
            className={cn(
              "h-10 w-10 rounded-full border text-[10px] uppercase tracking-[0.22em] transition-all",
              "backdrop-blur-sm",
              isSelected
                ? "border-white/60 bg-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                : "border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10",
            )}
          >
            {pattern.short}
          </button>
        );
      })}
    </div>
  );
};
