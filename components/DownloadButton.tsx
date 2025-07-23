"use client";

import { FiDownload } from "react-icons/fi";
import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";

interface DownloadButtonProps {
  resumeRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Floating circular DownloadButton (FAB) with label underneath.
 * Generates a compressed single-page PDF from a high-resolution JPEG.
 */
export default function DownloadButton({
  resumeRef,
}: DownloadButtonProps): JSX.Element {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!resumeRef.current || isLoading) return;

    setIsLoading(true);
    try {
      const element = resumeRef.current;

      // Render the component to a high-res canvas (scaled for detail)
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Export the canvas as a compressed JPEG
      const imgData = canvas.toDataURL("image/jpeg", 0.85); // High compression, good quality

      // Convert canvas dimensions to millimeters (adjusted for scale)
      const pxToMm = (px: number) => (px * 25.4) / 96 / 2.5;
      const pdfWidth = pxToMm(canvas.width);
      const pdfHeight = pxToMm(canvas.height);

      // Generate a single-page PDF matching the image size
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Roberto-Gallardo-CV.pdf");
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [resumeRef, isLoading]);

  return (
    <div className="flex flex-col items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={handleDownload}
        aria-label={t("downloadButton.ariaLabel", "Download PDF")}
        title={t("downloadButton.title", "Download PDF")}
        disabled={isLoading}
        className={`
          w-14 h-14 flex items-center justify-center
          bg-[var(--primary)] text-[var(--primary-foreground)]
          rounded-full shadow-xl
          hover:shadow-2xl hover:scale-105 active:scale-95
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-[var(--primary)]
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
      >
        <FiDownload className="w-6 h-6" />
      </button>
      <span className="text-xs text-muted-foreground font-medium select-none text-center">
        {isLoading
          ? t("downloadButton.loading", "Generating...")
          : t("downloadButton.text", "Download Resume")}
      </span>
    </div>
  );
}
