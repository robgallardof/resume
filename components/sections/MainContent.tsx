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
 * @returns {JSX.Element | null} The rendered resume content or null if translations missing.
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
        text-sm leading-tight
        space-y-8
        print:max-w-full print:px-6 print:py-4
      "
    >
      {/* Resume header with name and professional title */}
      <header className="text-center space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary leading-snug">
          {name}
        </h1>
        <p className="text-base text-muted-foreground">{title}</p>
      </header>

      {/* Structured sections separated visually */}
      <Separator />
      <AboutSection />
      <Separator />
      <ContactSection />
      <Separator />
      <SkillsSection />
      <Separator />
      <LanguagesSection />
      <Separator />
      <ExperienceSection />
      <Separator />
      <EducationSection />
      <Separator />
      <CertificationsSection />
    </section>
  );
}
