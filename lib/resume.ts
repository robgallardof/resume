import en from "@/app/i18n/locales/en.json";
import es from "@/app/i18n/locales/es.json";

/**
 * Typed view of the résumé content stored in the locale files.
 * The web page and the PDF both render from `getResume`, so they never drift apart.
 */

export type Lang = "en" | "es";

export const LANGS: readonly Lang[] = ["en", "es"];

export interface Job {
  company: string;
  role: string;
  period: string;
  details: string[];
}

export interface Project {
  name: string;
  url: string;
  description: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
  url?: string;
}

export interface Resume {
  lang: Lang;
  personal: {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    github: string;
    linkedin: string;
  };
  about: { title: string; text: string };
  skills: { title: string; groups: { category: string; items: string[] }[] };
  experience: { title: string; jobs: Job[] };
  projects: { title: string; role: string; period: string; items: Project[] };
  education: { title: string; items: { degree: string; institution: string; period: string }[] };
  certifications: { title: string; items: Certification[] };
  languages: { title: string; items: { name: string; level: string }[] };
  contactTitle: string;
  download: { text: string; title: string; ariaLabel: string; loading: string; error: string };
  labels: { page: string; of: string; present: string; credential: string; logout: string };
}

type Locale = typeof en;

const LOCALES: Record<Lang, Locale> = { en, es };

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "es";
}

/** Newest first, then alphabetical. */
export function sortCertifications(items: Certification[]): Certification[] {
  return [...items].sort(
    (a, b) => Number(b.year || 0) - Number(a.year || 0) || a.name.localeCompare(b.name)
  );
}

export function getResume(lang: Lang): Resume {
  const { personal, sections: s, downloadButton, labels } = LOCALES[lang];

  return {
    lang,
    personal,
    about: { title: s.about.title, text: s.about.data },
    skills: {
      title: s.skills.title,
      groups: s.skills.data.map((group) => ({
        category: group.category,
        items: group.items.map((item) => item.name),
      })),
    },
    experience: { title: s.experience.title, jobs: s.experience.data },
    projects: {
      title: s.projects.title,
      role: s.projects.role,
      period: s.projects.period,
      items: s.projects.data,
    },
    education: { title: s.education.title, items: s.education.data },
    certifications: {
      title: s.certifications.title,
      items: sortCertifications(s.certifications.data),
    },
    languages: {
      title: s.languages.title,
      items: s.languages.data.map(({ name, level }) => ({ name, level })),
    },
    contactTitle: s.contact.title,
    download: downloadButton,
    labels,
  };
}
