'use client'

import { JSX, useEffect, useState } from 'react'
import { FiGlobe } from 'react-icons/fi'
import Cookies from 'js-cookie'
import i18n from '@/app/i18n'

type Locale = 'en' | 'es'

/**
 * LanguageToggle is a compact button that toggles the site language
 * between English and Spanish using cookies and i18n.
 *
 * It waits until the client has mounted and the language is loaded
 * before rendering anything to prevent hydration mismatch.
 *
 * @returns {JSX.Element | null}
 */
export default function LanguageToggle(): JSX.Element | null {
  const [currentLocale, setCurrentLocale] = useState<Locale | null>(null)

  /**
   * Type guard for valid locales.
   */
  const isValidLocale = (value: unknown): value is Locale => {
    return value === 'en' || value === 'es'
  }

  /**
   * Load initial language from cookie once mounted on client.
   */
  useEffect(() => {
    const cookieLang = Cookies.get('language')
    const defaultLang: Locale = isValidLocale(cookieLang) ? cookieLang : 'en'
    i18n.changeLanguage(defaultLang)
    setCurrentLocale(defaultLang)
  }, [])

  if (!currentLocale) return null

  /**
   * Toggle the site language between 'en' and 'es'.
   */
  const toggleLanguage = (): void => {
    const nextLocale: Locale = currentLocale === 'en' ? 'es' : 'en'
    Cookies.set('language', nextLocale, { expires: 365 })
    i18n.changeLanguage(nextLocale)
    setCurrentLocale(nextLocale)
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