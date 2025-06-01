'use client';

import { JSX, useRef } from 'react';
import DownloadButton from '../components/DownloadButton';
import LanguageToggle from '../components/LanguageToggle';
import MainContent from '../components/sections/MainContent';

/**
 * Page component for displaying the resume with language toggle,
 * floating download FAB, and vertical scroll sidebar-style layout on large screens.
 *
 * @returns {JSX.Element} Resume layout with scrollable content and persistent footer.
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
        flex flex-col font-sans
        relative
      "
    >
      {/* Language toggle fixed top right */}
      <div className="absolute top-4 right-4 z-30 print:hidden">
        <LanguageToggle />
      </div>

      {/* Floating circular download button (bottom-right corner) */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <DownloadButton resumeRef={resumeRef} />
      </div>

      {/* Scrollable CV container with vertical scrollbar on large screens */}
      <div
        className="
          flex-grow w-full max-w-screen-md mx-auto
          bg-white dark:bg-[var(--card-dark,#1a1a1a)]
          rounded-xl shadow-lg
          overflow-y-auto
          transition-colors
          px-4 sm:px-6 md:px-8 lg:px-12 py-12
          lg:h-[calc(100vh-120px)]
          print:px-0 print:py-0 print:w-[8.5in] print:min-h-[11in] print:m-auto print:overflow-visible
        "
        ref={resumeRef}
        tabIndex={0}
        aria-label="Scrollable resume content"
      >
        <MainContent />
      </div>

      {/* Footer */}
      <footer
        className="
          w-full max-w-screen-lg mx-auto
          px-4 py-6 mt-8
          text-center text-sm
          text-muted-foreground
          print:hidden select-none
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