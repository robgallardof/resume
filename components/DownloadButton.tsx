"use client";

import { JSX, useCallback, useState } from "react";
import { FiDownload, FiLoader } from "react-icons/fi";
import type { Resume } from "@/lib/resume";

/** File name for the downloaded PDF, e.g. "Roberto-Gallardo-CV-EN.pdf". */
export function pdfFileName(resume: Resume): string {
  return `${resume.personal.name.replace(/\s+/g, "-")}-CV-${resume.lang.toUpperCase()}.pdf`;
}

/**
 * Floating button that builds a real, text-based PDF with @react-pdf/renderer.
 * The PDF library is loaded on demand, so it does not weigh on the first page load.
 */
export default function DownloadButton({ resume }: { resume: Resume }): JSX.Element {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleDownload = useCallback(async () => {
    if (status === "loading") return;
    setStatus("loading");
    try {
      const [{ pdf }, { default: ResumeDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/ResumeDocument"),
      ]);
      const blob = await pdf(<ResumeDocument resume={resume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = pdfFileName(resume);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("idle");
    } catch (error) {
      console.error("PDF generation error:", error);
      setStatus("error");
    }
  }, [resume, status]);

  const label =
    status === "loading" ? resume.download.loading : status === "error" ? resume.download.error : resume.download.text;

  return (
    <div className="flex flex-col items-end gap-2 print:hidden">
      <button
        type="button"
        onClick={handleDownload}
        disabled={status === "loading"}
        aria-label={resume.download.ariaLabel}
        title={resume.download.title}
        className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-700 to-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_-12px_rgb(109_40_217/0.8)] transition hover:brightness-110 active:scale-95 disabled:cursor-wait disabled:opacity-80"
      >
        {status === "loading" ? (
          <FiLoader className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <FiDownload className="h-5 w-5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
        )}
        <span aria-live="polite">{label}</span>
      </button>
    </div>
  );
}
