"use client";

import { JSX } from "react";
import { useTranslation } from "react-i18next";
import { FiLogOut } from "react-icons/fi";
import DownloadButton from "@/components/DownloadButton";
import LanguageToggle from "@/components/LanguageToggle";
import ResumeView from "@/components/resume/ResumeView";
import { getResume, isLang } from "@/lib/resume";

/**
 * Résumé page: toolbar (language, sign out), the résumé sheet and the floating PDF button.
 * Only reachable after the password gate in proxy.ts.
 */
export default function Page(): JSX.Element {
  const { i18n } = useTranslation();
  const resume = getResume(isLang(i18n.resolvedLanguage) ? i18n.resolvedLanguage : "en");

  return (
    <main className="min-h-screen bg-slate-100 bg-[radial-gradient(1200px_600px_at_0%_-10%,rgb(109_40_217/0.12),transparent_60%),radial-gradient(900px_500px_at_100%_110%,rgb(14_165_233/0.12),transparent_60%)] px-4 pb-28 pt-6 sm:px-6">
      <nav className="mx-auto mb-6 flex w-full max-w-[960px] items-center justify-end gap-2 print:hidden">
        <LanguageToggle />
        <a
          href="/__logout"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-slate-500 transition-colors hover:text-violet-700"
        >
          <FiLogOut className="h-4 w-4" aria-hidden="true" />
          {resume.labels.logout}
        </a>
      </nav>

      <ResumeView resume={resume} />

      <footer className="mx-auto mt-8 max-w-[960px] text-center text-sm text-slate-500 print:hidden">
        <a href="https://robertogallardo.dev" target="_blank" rel="noopener noreferrer" className="hover:text-violet-700">
          robertogallardo.dev
        </a>{" "}
        · © {new Date().getFullYear()} Roberto Gallardo
      </footer>

      <div className="fixed bottom-6 right-6 z-40">
        <DownloadButton resume={resume} />
      </div>
    </main>
  );
}
