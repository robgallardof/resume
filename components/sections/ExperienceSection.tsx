'use client';

import { JSX } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Renders the "Experience" section of the resume.
 *
 * Loads an array of job experiences from `sections.experience.data`,
 * each containing `role`, `company`, `period`, and `details` fields.
 *
 * @returns {JSX.Element | null} The rendered Experience section or null if no data is available.
 */
export default function ExperienceSection(): JSX.Element | null {
  const { t } = useTranslation();

  const experience = t('sections.experience.data', { returnObjects: true }) as {
    role: string;
    company: string;
    period: string;
    details: string[];
  }[];

  if (!experience?.length) return null;

  return (
    <section
      className="w-full space-y-2 print:space-y-1 print:max-w-[816px] print:mx-auto"
      aria-label="Professional Experience Section"
    >
      <h2 className="text-lg font-semibold text-primary tracking-tight print:text-base">
        {t('sections.experience.title', 'Professional Experience')}
      </h2>

      <div className="space-y-4 print:space-y-3">
        {experience.map((job, i) => (
          <div key={i} className="space-y-1 print:space-y-0.5">
            <h3 className="text-sm font-medium text-foreground print:text-[11px] print:font-semibold">
              {job.role} — {job.company}
            </h3>
            <p className="text-sm text-muted-foreground print:text-[10px] italic">
              {job.period}
            </p>
            <ul
              className="list-disc list-inside text-sm text-muted-foreground space-y-1 print:text-[10px] print:space-y-0.5"
              aria-label={`Details about role ${job.role} at ${job.company}`}
            >
              {job.details.map((detail, j) => (
                <li key={j}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}