'use client';

import { JSX } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Displays the "Languages" section of the resume in a minimalistic text format.
 *
 * @returns {JSX.Element | null} A section with language names and levels or null if no data exists.
 */
export default function LanguagesSection(): JSX.Element | null {
  const { t } = useTranslation();

  const languages = t('sections.languages.data', { returnObjects: true }) as {
    name: string;
    level: string;
  }[];

  if (!languages?.length) return null;

  return (
    <section className="w-full space-y-4">
      <h2 className="text-lg font-semibold text-primary tracking-tight">
        {t('sections.languages.title', 'Languages')}
      </h2>

      <ul className="space-y-2">
        {languages.map((lang) => (
          <li key={lang.name} className="text-muted-foreground">
            <span className="font-medium">{lang.name}</span> — {lang.level}
          </li>
        ))}
      </ul>
    </section>
  );
}