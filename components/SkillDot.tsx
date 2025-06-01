import { Progress } from "@/components/ui/progress";
import { JSX } from "react";

/**
 * Displays a skill with its name and level using a compact progress bar.
 *
 * @param name Skill name
 * @param level Skill proficiency percentage (0–100)
 * @returns {JSX.Element} A visual representation of the skill and its level.
 */
export default function SkillDot({
  name,
  level,
}: {
  name: string;
  level: number;
}): JSX.Element {
  const safeLevel = Math.max(0, Math.min(level, 100));

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground truncate">
          {name}
        </span>
        <span className="text-xs text-muted-foreground">{safeLevel}%</span>
      </div>
      <Progress value={safeLevel} className="h-[6px] rounded-sm" />
    </div>
  );
}
