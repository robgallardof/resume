// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ResumeView from "@/components/resume/ResumeView";
import { LANGS, getResume } from "@/lib/resume";

afterEach(cleanup);

describe.each(LANGS)("ResumeView (%s)", (lang) => {
  const resume = getResume(lang);

  it("renders the header and every section", () => {
    render(<ResumeView resume={resume} />);
    expect(screen.getByRole("heading", { level: 1, name: resume.personal.name })).toBeTruthy();
    for (const title of [
      resume.about.title,
      resume.experience.title,
      resume.projects.title,
      resume.certifications.title,
      resume.skills.title,
      resume.languages.title,
      resume.education.title,
    ]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeTruthy();
    }
  });

  it("lists every job with its details", () => {
    render(<ResumeView resume={resume} />);
    const timeline = screen.getByRole("heading", { level: 2, name: resume.experience.title })
      .parentElement as HTMLElement;
    const jobs = within(timeline).getAllByRole("heading", { level: 3 });
    expect(jobs).toHaveLength(resume.experience.jobs.length);
    for (const detail of resume.experience.jobs[0].details) {
      expect(within(timeline).getByText(detail)).toBeTruthy();
    }
  });

  it("links contact data and projects", () => {
    render(<ResumeView resume={resume} />);
    expect(screen.getByRole("link", { name: resume.personal.email }).getAttribute("href")).toBe(
      `mailto:${resume.personal.email}`
    );
    for (const project of resume.projects.items) {
      const link = screen.getByRole("link", { name: new RegExp(project.name) });
      expect(link.getAttribute("href")).toBe(project.url);
      expect(link.getAttribute("rel")).toContain("noopener");
    }
  });
});
