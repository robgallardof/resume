import { renderToBuffer } from "@react-pdf/renderer";
import { describe, expect, it } from "vitest";
import ResumeDocument from "@/components/pdf/ResumeDocument";
import { pdfFileName } from "@/components/DownloadButton";
import { LANGS, getResume } from "@/lib/resume";

describe.each(LANGS)("PDF export (%s)", (lang) => {
  const resume = getResume(lang);

  it("produces a real multi-page A4 PDF with metadata and links", async () => {
    const buffer = await renderToBuffer(<ResumeDocument resume={resume} />);
    const raw = buffer.toString("latin1");

    expect(raw.startsWith("%PDF-")).toBe(true);
    const pages = raw.match(/\/Type\s*\/Page(?!s)/g) ?? [];
    expect(pages.length).toBeGreaterThanOrEqual(2);
    expect(raw).toMatch(/\/MediaBox\s*\[\s*0 0 595\.2?8?\d* 841\.8?9?\d*\s*\]/);
    expect(raw).toContain("/Title");
    expect(raw).toContain("/URI");
    expect(raw).toContain(resume.projects.items[0].url);
    // Vector text, not one big screenshot.
    expect(raw).toContain("/Helvetica");
    expect(raw).not.toContain("/DCTDecode");
  });

  it("fits in two pages with no blank trailing page", async () => {
    // A résumé should stay concise; this also catches layout spills that add an empty last page.
    const raw = (await renderToBuffer(<ResumeDocument resume={resume} />)).toString("latin1");
    expect((raw.match(/\/Type\s*\/Page(?!s)/g) ?? []).length).toBe(2);
  });

  it("uses a descriptive file name", () => {
    expect(pdfFileName(resume)).toBe(`Roberto-Gallardo-CV-${lang.toUpperCase()}.pdf`);
  });
});
