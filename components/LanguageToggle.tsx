'use client'

import { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { FiGlobe } from 'react-icons/fi'
import Cookies from 'js-cookie'

type Locale = 'en' | 'es'

/**
 * LanguageToggle is a compact button that toggles the site language
 * between English and Spanish using cookies and i18n.
 *
 * The current language comes from i18n (synchronized from the cookie by the
 * i18n provider); LanguageGate keeps it from rendering on the server.
 *
 * @returns {JSX.Element | null}
 */
export default function LanguageToggle(): JSX.Element | null {
  const { i18n } = useTranslation()
  const currentLocale: Locale = i18n.resolvedLanguage === 'es' ? 'es' : 'en'

  /**
   * Toggle the site language between 'en' and 'es'.
   */
  const toggleLanguage = (): void => {
    const nextLocale: Locale = currentLocale === 'en' ? 'es' : 'en'
    Cookies.set('language', nextLocale, { expires: 365 })
    i18n.changeLanguage(nextLocale)
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className="
        flex items-center gap-1
        text-[var(--muted-foreground)]
        hover:text-[var(--primary)]
        transition-colors duration-200
        cursor-pointer
        rounded-md
        select-none
        px-2 py-1
        focus:outline-none
      "
      // Prevent default focus ring and outline
      onFocus={(e) => e.currentTarget.style.outline = 'none'}
      onBlur={(e) => e.currentTarget.style.outline = 'none'}
    >
      <FiGlobe className="w-5 h-5" />
      <span className="text-sm uppercase">{currentLocale}</span>
    </button>
  )
}
