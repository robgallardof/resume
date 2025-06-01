import { ReactI18NextChildren } from "react-i18next";

/**
 * Represents a professional work experience entry.
 */
export interface ExperienceItem {
  /** Company name */
  company: string;

  /** Job title or role */
  role: string;

  /** Employment period (e.g. "2023 – Present") */
  period: string;

  /** List of bullet points (responsibilities, achievements) */
  details: string[];
}

/**
 * Represents an educational background entry.
 */
export interface EducationItem {
  /** Degree name (e.g. "Master of Software Architecture") */
  degree: string;

  /** Institution name */
  institution: string;

  /** Time period of study */
  period: string;
}

/**
 * Represents a skill with a name and proficiency level (0–100).
 */
export interface SkillItem {
  /** Name of the skill (e.g. "React", "C#") */
  name: string;

  /** Proficiency level (percentage from 0 to 100) */
  level: number;
}

/**
 * Represents a professional certification.
 */
export interface CertificationItem {
  /** Full title, e.g. "Azure Fundamentals — 2023" (can be localized) */
  title: ReactI18NextChildren | Iterable<ReactI18NextChildren>;

  /** Organization issuing the certification (can be localized) */
  org: ReactI18NextChildren | Iterable<ReactI18NextChildren>;

  /** Raw certification name (used for display logic or filtering) */
  name: string;

  /** Issuer of the certification */
  issuer: string;

  /** Year awarded */
  year: string;

  /** Link to certificate */
  url: string;
}

/**
 * Contact details section.
 */
export interface Contact {
  /** Phone number (optional or string if available) */
  phone?: string;

  /** Email address */
  email: string;

  /** Personal website URL */
  website?: string;

  /** LinkedIn profile */
  linkedin?: string;

  /** GitHub profile */
  github?: string;
}

/**
 * Represents a language proficiency.
 */
export interface LanguageSkill {
  /** Language name (e.g. "Spanish", "English") */
  name: string;

  /** Descriptive level (e.g. "Native", "Professional") */
  level: string;

  /** Proficiency as percentage (for progress visual) */
  percentage: number;
}
