import { JSX } from "react";

/**
 * Props for the LanguageCircle component.
 */
interface LanguageCircleProps {
  name: string;
  level: string;
  percentage: number;
}

/**
 * Renders a language skill as a circular progress indicator with name and proficiency.
 *
 * @component
 * @param {string} name - The name of the language (e.g., "English").
 * @param {string} level - The proficiency level (e.g., "Native", "Fluent").
 * @param {number} percentage - A value from 0 to 100 representing proficiency.
 * @returns {JSX.Element} The rendered visual language circle.
 */
export default function LanguageCircle({
  name,
  level,
  percentage,
}: LanguageCircleProps): JSX.Element {
  const safePercentage = Math.max(0, Math.min(percentage, 100));
  const radius = 28;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = `${
    circumference - (safePercentage / 100) * circumference
  }`;

  return (
    <div className="flex flex-col items-center text-center w-20 sm:w-24">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-auto"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground"
          opacity={0.2}
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-700 ease-out"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[0.55rem] sm:text-xs font-medium fill-foreground"
        >
          {safePercentage}%
        </text>
      </svg>

      <p className="mt-1 text-xs sm:text-sm font-medium text-foreground">
        {name}
      </p>
      <p className="text-[0.65rem] sm:text-xs text-muted-foreground">{level}</p>
    </div>
  );
}
