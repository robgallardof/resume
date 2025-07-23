'use client';

import { JSX } from 'react';
import { FaCertificate } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

/**
 * Displays the "Certifications" section of the resume.
 *
 * Shows certifications sorted by year and name, with title, issuer, year,
 * credential ID and full visible URL. Matches style with AboutSection.
 *
 * @returns {JSX.Element | null}
 */
export default function CertificationsSection(): JSX.Element | null {
  const { t } = useTranslation();

  const certifications = t('sections.certifications.data', {
    returnObjects: true,
  }) as {
    name: string;
    issuer: string;
    year?: string;
    credentialId?: string;
    url?: string;
  }[];

  if (!certifications?.length) return null;

  const sortedCerts = [...certifications].sort((a, b) => {
    const yearA = parseInt(a.year || '0');
    const yearB = parseInt(b.year || '0');
    if (yearA !== yearB) return yearB - yearA;
    return a.name.localeCompare(b.name);
  });

  return (
    <section className="w-full space-y-2 print:space-y-1">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-primary tracking-tight print:text-base">
        <FaCertificate className="text-primary" />
        {t('sections.certifications.title', 'Certifications')}
      </h2>

      <ul className="space-y-2">
        {sortedCerts.map((cert, i) => (
          <li key={i} className="text-sm text-muted-foreground leading-relaxed print:text-[11px] print:leading-snug">
            <div className="text-foreground font-medium">
              {cert.url ? (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary transition-colors"
                >
                  {cert.name}
                </a>
              ) : (
                cert.name
              )}
            </div>
            <div>
              {cert.issuer}
              {cert.year && ` (${cert.year})`}
            </div>
            {cert.credentialId && (
              <div className="text-xs print:text-[10px]">
                ID: {cert.credentialId}
              </div>
            )}
            {cert.url && (
              <div className="text-xs break-all text-blue-600 underline print:text-[10px]">
                <a href={cert.url} target="_blank" rel="noopener noreferrer">
                  {cert.url}
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}