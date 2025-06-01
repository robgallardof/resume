"use client";

import { JSX } from "react";
import { FaCertificate } from "react-icons/fa";
import { useTranslation } from "react-i18next";

/**
 * Renders the "Certifications" section of the resume.
 *
 * Displays a list of certifications from `sections.certifications.data`,
 * including name, issuer, optional year, and optional URL.
 *
 * @returns {JSX.Element} Rendered certifications section or null if empty.
 */
export default function CertificationsSection(): JSX.Element {
  const { t } = useTranslation();

  const certifications = t("sections.certifications.data", {
    returnObjects: true,
  }) as {
    name: string;
    issuer: string;
    year?: string;
    url?: string;
  }[];

  if (!certifications?.length) return <></>;

  return (
    <section className="w-full space-y-2">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-primary tracking-tight">
        <FaCertificate className="text-primary" />
        {t("sections.certifications.title", "Certifications")}
      </h2>

      <ul className="space-y-2">
        {certifications.map((cert, i) => (
          <li key={i} className="text-sm text-muted-foreground leading-snug">
            {cert.url ? (
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline hover:text-primary transition-colors"
              >
                {cert.name}
              </a>
            ) : (
              <span className="text-foreground font-medium">{cert.name}</span>
            )}
            {" — "}
            {cert.issuer}
            {cert.year ? ` (${cert.year})` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
