'use client';

import { FiDownload } from 'react-icons/fi';
import { useCallback, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { JSX } from 'react/jsx-runtime';
import { useTranslation } from 'react-i18next';

interface DownloadButtonProps {
  resumeRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Floating circular DownloadButton (FAB) with label underneath.
 *
 * @param {DownloadButtonProps} props - Component props.
 * @returns {JSX.Element} Floating FAB with label below the icon.
 */
export default function DownloadButton({ resumeRef }: DownloadButtonProps): JSX.Element {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!resumeRef.current || isLoading) return;

    setIsLoading(true);
    try {
      const element = resumeRef.current;

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const pdfWidth = 216;
      const pdfHeight = 356;
      const dpi = 96;
      const pxPerMm = (dpi / 25.4) * 3;
      const pageHeightPx = pdfHeight * pxPerMm;
      const totalHeightPx = canvas.height;
      const totalPages = Math.ceil(totalHeightPx / pageHeightPx);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfHeight, pdfWidth],
      });

      for (let page = 0; page < totalPages; page++) {
        const pageCanvas = document.createElement('canvas');
        const segmentHeight = Math.min(pageHeightPx, totalHeightPx - page * pageHeightPx);

        pageCanvas.width = canvas.width;
        pageCanvas.height = segmentHeight;

        const ctx = pageCanvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(
          canvas,
          0,
          page * pageHeightPx,
          canvas.width,
          segmentHeight,
          0,
          0,
          canvas.width,
          segmentHeight
        );

        const segmentData = pageCanvas.toDataURL('image/jpeg', 1.0);
        const segmentHeightMm = (segmentHeight * pdfWidth) / canvas.width;

        if (page > 0) pdf.addPage();
        pdf.addImage(segmentData, 'JPEG', 0, 0, pdfWidth, segmentHeightMm);
      }

      pdf.save('Roberto-Gallardo-CV.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [resumeRef, isLoading]);

  return (
    <div className="flex flex-col items-center gap-2 print:hidden">
      {/* Circular button */}
      <button
        type="button"
        onClick={handleDownload}
        aria-label={t('downloadButton.ariaLabel', 'Download PDF')}
        title={t('downloadButton.title', 'Download PDF')}
        disabled={isLoading}
        className={`
          w-14 h-14
          flex items-center justify-center
          bg-[var(--primary)] text-[var(--primary-foreground)]
          rounded-full
          shadow-xl
          hover:shadow-2xl hover:scale-105
          active:scale-95
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-[var(--primary)]
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
      >
        <FiDownload className="w-6 h-6" />
      </button>

      {/* Text label underneath */}
      <span className="text-xs text-muted-foreground font-medium select-none text-center">
        {isLoading
          ? t('downloadButton.loading', 'Generating...')
          : t('downloadButton.text', 'Download Resume')}
      </span>
    </div>
  );
}