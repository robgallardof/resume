"use client";

import { JSX } from "react";
import { useTranslation } from "react-i18next";

import AboutSection from "./AboutSection";
import CertificationsSection from "./CertificationsSection";
import ContactSection from "./ContactSection";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import SkillsSection from "./SkillsSection";
import LanguagesSection from "./LanguagesSection";
import { Separator } from "@/components/ui/separator";

/**
 * MainContent component renders the full resume content.
 *
 * It loads translated personal data and renders all resume sections:
 * - Header with name and title
 * - About, Contact, Skills, Languages, Experience, Education, Certifications
 * - Separators between sections for clear visual grouping
 *
 * The layout is constrained for screen and optimized for print.
 *
 * @returns {JSX.Element | null} The rendered resume content or null if translations are missing.
 */
export default function MainContent(): JSX.Element | null {
  const { t } = useTranslation();

  const name = t("personal.name", "Roberto Gallardo");
  const title = t("personal.title", "Full Stack .NET Developer");

  return (
    <section
      className="
        w-full max-w-[720px] mx-auto
        px-4 py-8
        font-sans text-gray-900 dark:text-white
        text-[0.875rem] leading-tight
        space-y-8

        print:w-full print:max-w-[190mm] print:px-[24pt] print:py-[18pt]
        print:text-[10pt] print:leading-[1.4]
      "
    >
      {/* Resume header with name and professional title */}
      <header className="text-center space-y-1 print:space-y-0">
        <h1
          className="
            text-3xl font-bold tracking-tight text-primary leading-snug
            print:text-[16pt] print:leading-tight print:mb-1
          "
        >
          {name}
        </h1>
        <p
          className="
            text-base text-muted-foreground
            print:text-[10pt] print:text-muted-foreground print:leading-tight
          "
        >
          {title}
        </p>
      </header>

      {/* Structured resume sections with visual separators */}
      <Separator />
      <AboutSection />
      <Separator />
      <LanguagesSection />
      <Separator />
      <ContactSection />
      <Separator />
      <SkillsSection />
      <Separator />
      <ExperienceSection />
      <Separator />
      <EducationSection />
      <Separator />
      <CertificationsSection />
    </section>
  );
}