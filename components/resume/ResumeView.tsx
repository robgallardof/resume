import { JSX, ReactNode } from "react";
import { FiGithub, FiGlobe, FiLinkedin, FiMail, FiMapPin, FiPhone, FiExternalLink } from "react-icons/fi";
import type { Resume } from "@/lib/resume";

/**
 * Presentational résumé: a printable "sheet" with a header band, a sidebar
 * (contact, skills, languages, education) and a main column (profile,
 * experience timeline, open-source projects, certifications).
 */

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function SectionTitle({ children }: { children: ReactNode }): JSX.Element {
  return (
    <h2 className="mb-4 flex items-center gap-3 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-violet-700">
      {children}
      <span className="h-px flex-1 bg-gradient-to-r from-violet-200 to-transparent" aria-hidden="true" />
    </h2>
  );
}

function SideTitle({ children }: { children: ReactNode }): JSX.Element {
  return (
    <h2 className="mb-3 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-slate-500">{children}</h2>
  );
}

export default function ResumeView({ resume }: { resume: Resume }): JSX.Element {
  const { personal: p } = resume;

  const contact = [
    { icon: FiMail, label: p.email, href: `mailto:${p.email}` },
    { icon: FiPhone, label: p.phone, href: `tel:${p.phone.replace(/\s+/g, "")}` },
    { icon: FiGlobe, label: displayUrl(p.website), href: p.website },
    { icon: FiLinkedin, label: displayUrl(p.linkedin), href: p.linkedin },
    { icon: FiGithub, label: displayUrl(p.github), href: p.github },
  ];

  return (
    <article
      className="mx-auto w-full max-w-[960px] overflow-hidden rounded-3xl bg-white text-slate-800 shadow-[0_30px_80px_-30px_rgb(15_23_42/0.35)] ring-1 ring-slate-200/70"
      aria-label={p.name}
    >
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-sky-600 px-8 py-10 text-white sm:px-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{p.name}</h1>
          <p className="mt-2 max-w-2xl text-base font-medium text-white/85 sm:text-lg">{p.title}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
            <FiMapPin aria-hidden="true" /> {p.location}
          </p>
        </div>
      </header>

      <div className="grid md:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-8 border-b border-slate-100 bg-slate-50/80 px-8 py-8 md:border-b-0 md:border-r">
          <section>
            <SideTitle>{resume.contactTitle}</SideTitle>
            <ul className="space-y-2.5">
              {contact.map(({ icon: Icon, label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-violet-700"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-violet-700 shadow-sm ring-1 ring-slate-200 group-hover:ring-violet-300">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="break-all">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SideTitle>{resume.skills.title}</SideTitle>
            <div className="space-y-4">
              {resume.skills.groups.map((group) => (
                <div key={group.category}>
                  <h3 className="mb-2 text-sm font-semibold text-slate-700">{group.category}</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SideTitle>{resume.languages.title}</SideTitle>
            <ul className="space-y-2">
              {resume.languages.items.map((lang) => (
                <li key={lang.name} className="text-sm">
                  <span className="font-semibold text-slate-700">{lang.name}</span>
                  <span className="block text-slate-500">{lang.level}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SideTitle>{resume.education.title}</SideTitle>
            <ul className="space-y-4">
              {resume.education.items.map((edu) => (
                <li key={edu.degree} className="text-sm">
                  <p className="font-semibold leading-snug text-slate-700">{edu.degree}</p>
                  <p className="mt-0.5 text-slate-500">{edu.institution}</p>
                  <p className="mt-0.5 text-xs font-medium text-violet-700">{edu.period}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Main column */}
        <div className="space-y-10 px-8 py-8 sm:px-10">
          <section>
            <SectionTitle>{resume.about.title}</SectionTitle>
            <p className="whitespace-pre-line text-[0.95rem] leading-relaxed text-slate-600">{resume.about.text}</p>
          </section>

          <section>
            <SectionTitle>{resume.experience.title}</SectionTitle>
            <ol className="relative space-y-8 border-l-2 border-violet-100 pl-6">
              {resume.experience.jobs.map((job) => (
                <li key={`${job.company}-${job.period}`} className="relative">
                  <span
                    className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-violet-600 ring-2 ring-violet-200"
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-base font-semibold text-slate-800">
                      {job.role} <span className="font-normal text-slate-400">·</span>{" "}
                      <span className="text-violet-700">{job.company}</span>
                    </h3>
                    <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                      {job.period}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {job.details.map((detail) => (
                      <li key={detail} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <SectionTitle>{resume.projects.title}</SectionTitle>
            <p className="-mt-2 mb-4 text-sm text-slate-500">
              {resume.projects.role} · {resume.projects.period}
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {resume.projects.items.map((project) => (
                <li key={project.name}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
                  >
                    <span className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-800 group-hover:text-violet-700">
                      {project.name}
                      <FiExternalLink className="shrink-0 text-slate-400 group-hover:text-violet-600" aria-hidden="true" />
                    </span>
                    <span className="mt-1.5 block text-xs leading-relaxed text-slate-500">{project.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionTitle>{resume.certifications.title}</SectionTitle>
            <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {resume.certifications.items.map((cert) => (
                <li key={`${cert.issuer}-${cert.name}`} className="text-sm">
                  {cert.url ? (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-violet-700 hover:decoration-violet-400"
                    >
                      {cert.name}
                    </a>
                  ) : (
                    <span className="font-medium text-slate-700">{cert.name}</span>
                  )}
                  <span className="block text-xs text-slate-500">
                    {cert.issuer} · {cert.year}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
