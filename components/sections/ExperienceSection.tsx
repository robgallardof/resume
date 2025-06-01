"use client";

import { JSX } from "react";
import { useTranslation } from "react-i18next";

/**
 * Renders the "Experience" section of the resume.
 *
 * Loads an array of job experiences from `sections.experience.data`,
 * each containing `role`, `company`, `period`, and `details` fields.
 *
 * The section is responsive and optimized for readability.
 *
 * @returns {JSX.Element | null} The rendered Experience section or null if no data is available.
 */
export default function ExperienceSection(): JSX.Element | null {
  const { t } = useTranslation();

  /** Array of job experience entries */
  const experience = t("sections.experience.data", { returnObjects: true }) as {
    role: string;
    company: string;
    period: string;
    details: string[];
  }[];

  if (!experience?.length) return null;

  return (
    <section
      className="
        w-full
        space-y-2
        print:max-w-[816px]     /* US Legal width */
        print:mx-auto
        print:space-y-1
        sm:space-y-3
        md:space-y-4
      "
      style={{ maxWidth: "816px", margin: "0 auto" }}
      aria-label="Professional Experience Section"
    >
      <h2
        className="
          text-lg font-semibold text-primary tracking-tight
          print:text-base
          sm:text-xl
          md:text-2xl
          print:md:text-lg
          print:lg:text-xl
        "
      >
        {t("sections.experience.title", "Professional Experience")}
      </h2>

      <div className="space-y-4 print:space-y-3">
        {experience.map((job, i) => (
          <div key={i} className="space-y-1 print:space-y-0.5">
            <h3
              className="
                text-sm sm:text-base font-medium text-foreground
                print:text-sm print:font-semibold
              "
            >
              {job.role} — {job.company}
            </h3>
            <p
              className="
                text-sm text-muted-foreground
                print:text-xs print:italic
              "
            >
              {job.period}
            </p>
            <ul
              className="
                list-disc list-inside text-sm text-muted-foreground space-y-1
                print:text-xs print:space-y-0.5
              "
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
