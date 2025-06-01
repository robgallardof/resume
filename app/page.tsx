'use client';

import { JSX, useRef } from 'react';
import DownloadButton from '../components/DownloadButton';
import LanguageToggle from '../components/LanguageToggle';
import MainContent from '../components/sections/MainContent';

/**
 * Page component for displaying the resume with language toggle and download controls.
 *
 * - The language toggle button is fixed at the top-right corner.
 * - The download button is positioned as a sticky footer above the page footer,
 *   always visible for easy access without disrupting the reading flow.
 * - The resume content area is scrollable inside a card-style container with padding and shadow.
 * - Footer includes developer credits and is hidden in print.
 *
 * @returns {JSX.Element} The complete resume page layout.
 */
export default function Page(): JSX.Element {
  const resumeRef = useRef<HTMLDivElement>(null);

  return (
    <main
      className="
        min-h-screen w-full
        bg-gradient-to-br from-muted/30 via-white to-muted
        dark:from-neutral-800 dark:via-neutral-900 dark:to-black
        text-gray-900 dark:text-white
        flex flex-col relative
        font-sans
      "
    >
      {/* Language toggle fixed top right */}
      <div
        className="
          absolute top-4 right-4 z-20
          print:hidden
        "
      >
        <LanguageToggle />
      </div>

      {/* Resume content area inside a card container */}
      <div
        ref={resumeRef}
        className="
          w-full max-w-screen-md mx-auto
          px-4 sm:px-6 md:px-8 lg:px-12 pb-6 pt-8
          print:px-0 print:pt-0 print:pb-0 print:w-[8.5in] print:min-h-[11in] print:m-auto
          bg-white dark:bg-[var(--card-dark,#1a1a1a)]
          rounded-xl shadow-lg
          flex-grow
          overflow-auto
          max-h-[calc(100vh-160px)]
          transition-colors
        "
        tabIndex={0}
        aria-label="Scrollable resume content"
      >
        <MainContent />
      </div>

      {/* Sticky download button above footer for UX */}
      <div
        className="
          w-full max-w-screen-md mx-auto
          px-4 sm:px-6 md:px-8 lg:px-12
          print:hidden
          sticky bottom-16
          bg-white dark:bg-[var(--card-dark,#1a1a1a)]
          border-t border-gray-200 dark:border-neutral-700
          flex justify-center
          py-3
          z-10
          shadow-md
          rounded-t-md
        "
      >
        <DownloadButton resumeRef={resumeRef} />
      </div>

      {/* Footer with developer credits, hidden in print */}
      <footer
        className="
          w-full max-w-screen-lg mx-auto
          px-4 py-4
          text-center text-sm
          text-muted-foreground
          print:hidden
          select-none
        "
      >
        <p>
          Developed by{' '}
          <a
            href="https://robertogallardo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            Roberto Gallardo
          </a>
          . © {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}