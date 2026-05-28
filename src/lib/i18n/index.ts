import { create } from 'zustand'
import en from './en.json'
import sw from './sw.json'

export type Locale = 'en' | 'sw'

type TranslationMap = typeof en

const translations: Record<Locale, TranslationMap> = { en, sw }

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return path
    }
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === 'string' ? current : path
}

interface I18nState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useI18nStore = create<I18nState>((set) => ({
  locale: 'en',
  setLocale: (locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moka_locale', locale)
      document.documentElement.lang = locale
    }
    set({ locale })
  },
}))

// Initialize locale from localStorage on client
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('moka_locale') as Locale | null
  if (saved && (saved === 'en' || saved === 'sw')) {
    useI18nStore.setState({ locale: saved })
    document.documentElement.lang = saved
  }
}

/**
 * Translate a key to the current locale string.
 * Supports interpolation with {key} syntax.
 * e.g. t('newStock.addedToCart', { name: 'Honda CBR' })
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const locale = useI18nStore.getState().locale
  let value = getNestedValue(translations[locale] as unknown as Record<string, unknown>, key)

  if (value === key && locale !== 'en') {
    // Fallback to English if key not found in current locale
    value = getNestedValue(translations.en as unknown as Record<string, unknown>, key)
  }

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, String(v))
    }
  }

  return value
}

/**
 * React hook that returns the translation function and current locale.
 * Re-renders when locale changes.
 */
export function useTranslation() {
  const locale = useI18nStore((s) => s.locale)
  const setLocale = useI18nStore((s) => s.setLocale)

  const translate = (key: string, params?: Record<string, string | number>): string => {
    let value = getNestedValue(translations[locale] as unknown as Record<string, unknown>, key)

    if (value === key && locale !== 'en') {
      value = getNestedValue(translations.en as unknown as Record<string, unknown>, key)
    }

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v))
      }
    }

    return value
  }

  return { t: translate, locale, setLocale }
}
