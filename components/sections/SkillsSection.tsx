'use client';

import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

/**
 * Represents a single skill.
 */
interface SkillItem {
  name: string;
  level?: number;
}

/**
 * Represents a skill category.
 */
interface SkillCategory {
  category: string;
  items: SkillItem[];
}

/**
 * Displays the categorized "Skills" section with minimalistic badges.
 *
 * Loads categories and their respective skills from `sections.skills.data`
 * and uses the section title from `sections.skills.title`.
 *
 * @returns {JSX.Element | null} The skills section or null if no data found.
 */
export default function SkillsSection(): JSX.Element | null {
  const { t } = useTranslation();

  const skills = t('sections.skills.data', {
    returnObjects: true,
  }) as SkillCategory[];

  const title = t('sections.skills.title', 'Skills');

  if (!Array.isArray(skills) || skills.length === 0) return null;

  return (
    <section className="w-full space-y-2 print:space-y-1">
      <h2 className="text-lg font-semibold text-primary tracking-tight print:text-base">
        {title}
      </h2>

      {skills.map((category) => (
        <div key={category.category} className="space-y-1">
          <h3 className="text-sm text-muted-foreground font-medium print:text-[11px]">
            {category.category}
          </h3>

          <div className="flex flex-wrap gap-1.5 print:gap-1">
            {category.items.map((skill) => (
              <Badge
                key={skill.name}
                className="text-xs font-normal px-2 py-[2px] rounded-full bg-muted/20 text-foreground border border-border print:bg-transparent print:border-none print:px-1 print:py-0.5"
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}