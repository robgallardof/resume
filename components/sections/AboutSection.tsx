"use client";

import { JSX } from "react";
import { useTranslation } from "react-i18next";

/**
 * Displays the "About Me" section of the resume.
 *
 * Loads the content from i18n under `sections.about.data` and title from `sections.about.title`.
 *
 * @returns {JSX.Element | null} Rendered section or null if content is empty.
 */
export default function AboutSection(): JSX.Element | null {
  const { t } = useTranslation();

  const about = t("sections.about.data");
  const aboutTitle = t("sections.about.title", "About Me");

  if (!about?.trim()) return null;

  return (
    <section className="w-full space-y-2 print:space-y-1">
      <h2 className="text-lg font-semibold text-primary tracking-tight print:text-base">
        {aboutTitle}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed print:text-[11px] print:leading-snug">
        {about}
      </p>
    </section>
  );
}
