"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

interface I18nextProviderWrapperProps {
  children: React.ReactNode;
  lang?: string; 
}

/**
 * Client-side provider for react-i18next.
 *
 * Synchronizes language from server to avoid hydration mismatch.
 *
 * @param children Wrapped components
 * @param lang Initial language from cookie or server
 * @returns I18n context wrapper
 */
export function I18nextProviderWrapper({
  children,
  lang = "en",
}: I18nextProviderWrapperProps) {
  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
