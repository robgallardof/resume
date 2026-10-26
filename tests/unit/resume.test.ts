import { describe, expect, it } from "vitest";
import { LANGS, getResume, isLang, sortCertifications } from "@/lib/resume";
import { pdfSafe } from "@/lib/pdf-text";

const en = getResume("en");
const es = getResume("es");

/** Every string in a value, recursively. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("résumé content", () => {
  it("has the same shape in English and Spanish", () => {
    expect(es.experience.jobs.length).toBe(en.experience.jobs.length);
    expect(es.projects.items.length).toBe(en.projects.items.length);
    expect(es.education.items.length).toBe(en.education.items.length);
    expect(es.certifications.items.length).toBe(en.certifications.items.length);
    expect(es.languages.items.length).toBe(en.languages.items.length);
    expect(es.skills.groups.map((g) => g.items.length)).toEqual(en.skills.groups.map((g) => g.items.length));
    es.experience.jobs.forEach((job, i) => {
      expect(job.company).toBe(en.experience.jobs[i].company);
      expect(job.details.length).toBe(en.experience.jobs[i].details.length);
    });
  });

  it.each(LANGS)("keeps the contact data consistent (%s)", (lang) => {
    const { personal } = getResume(lang);
    expect(personal.email).toBe("robgallardofl@gmail.com");
    expect(personal.linkedin).toBe("https://linkedin.com/in/robgallardof");
    expect(personal.website).toBe("https://robertogallardo.dev");
    expect(personal.github).toBe("https://github.com/robgallardof");
  });

  it.each(LANGS)("shows the master's degree as completed and issued by Marconi (%s)", (lang) => {
    const [masters] = getResume(lang).education.items;
    expect(masters.institution).toContain("Guglielmo Marconi");
    expect(masters.degree).not.toMatch(/progress|curso/i);
  });

  it.each(LANGS)("uses only https links (%s)", (lang) => {
    const resume = getResume(lang);
    const urls = [
      ...resume.projects.items.map((p) => p.url),
      ...resume.certifications.items.flatMap((c) => (c.url ? [c.url] : [])),
    ];
    expect(urls.length).toBeGreaterThan(0);
    urls.forEach((url) => expect(url).toMatch(/^https:\/\//));
  });

  it.each(LANGS)("has no dead domains or leftover placeholders (%s)", (lang) => {
    const text = strings(getResume(lang)).join("\n");
    expect(text).not.toMatch(/robertogallardo\.mx|lrobertogallardo|In Progress|En curso|lorem ipsum/i);
    expect(text).not.toMatch(/\b(TODO|FIXME|TBD)\b/);
  });

  it.each(LANGS)("has no empty text (%s)", (lang) => {
    for (const text of strings(getResume(lang))) {
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });

  it.each(LANGS)("renders in the PDF font without losing characters (%s)", (lang) => {
    for (const text of strings(getResume(lang))) {
      expect(pdfSafe(text)).toBe(text.trim());
    }
  });
});

describe("sortCertifications", () => {
  it("orders newest first, then by name", () => {
    const sorted = sortCertifications([
      { name: "B", issuer: "x", year: "2022" },
      { name: "A", issuer: "x", year: "2022" },
      { name: "Z", issuer: "x", year: "2023" },
    ]);
    expect(sorted.map((c) => c.name)).toEqual(["Z", "A", "B"]);
  });
});

describe("isLang", () => {
  it("accepts only supported languages", () => {
    expect(isLang("en")).toBe(true);
    expect(isLang("es")).toBe(true);
    expect(isLang("fr")).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });
});

describe("pdfSafe", () => {
  it("replaces glyphs Helvetica cannot draw", () => {
    expect(pdfSafe(".NET Framework → .NET 10 ✓ 🚀")).toBe(".NET Framework -> .NET 10 +");
  });

  it("keeps Spanish and Italian accents and typographic dashes", () => {
    const text = "Università · Maestría — España – ñ “ok” ’";
    expect(pdfSafe(text)).toBe(text);
  });
});
