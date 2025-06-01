"use client";

import { JSX } from "react";
import { useTranslation } from "react-i18next";
import LanguageCircle from "../LanguageCircle";

/**
 * Displays the "Languages" section of the resume.
 *
 * The title is left-aligned, and the language proficiency circles are centered.
 * Data is sourced from `sections.languages.data` i18n key.
 *
 * @returns {JSX.Element | null} A section with language indicators or null if no data exists.
 */
export default function LanguagesSection(): JSX.Element | null {
  const { t } = useTranslation();

  const languages = t("sections.languages.data", { returnObjects: true }) as {
    name: string;
    level: string;
    percentage?: number;
  }[];

  if (!languages?.length) return null;

  return (
    <section className="w-full space-y-4">
      <h2 className="text-lg font-semibold text-primary tracking-tight">
        {t("sections.languages.title", "Languages")}
      </h2>

      <div className="flex flex-wrap justify-center gap-6 print:gap-4">
        {languages.map((lang) => (
          <LanguageCircle
            key={lang.name}
            name={lang.name}
            level={lang.level}
            percentage={lang.percentage ?? 0}
          />
        ))}
      </div>
    </section>
  );
}
