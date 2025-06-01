"use client";

import { JSX } from "react";
import { useTranslation } from "react-i18next";

/**
 * Displays the "Education" section of the resume.
 *
 * Loads an array of education entries from `sections.education.data`,
 * each with `degree`, `institution`, and `period`.
 *
 * @returns {JSX.Element | null} Rendered education section or null if empty.
 */
export default function EducationSection(): JSX.Element | null {
  const { t } = useTranslation();

  const education = t("sections.education.data", { returnObjects: true }) as {
    degree: string;
    institution: string;
    period: string;
  }[];

  if (!education?.length) return null;

  return (
    <section className="w-full space-y-2">
      <h2 className="text-lg font-semibold text-primary tracking-tight">
        {t("sections.education.title", "Education")}
      </h2>

      <div className="space-y-3">
        {education.map((edu, i) => (
          <div key={i} className="space-y-1">
            <p className="text-sm font-medium text-foreground">{edu.degree}</p>
            <p className="text-sm text-muted-foreground">
              {edu.institution} — {edu.period}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
