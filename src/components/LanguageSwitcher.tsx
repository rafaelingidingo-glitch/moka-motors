'use client'

import { useTranslation } from '@/lib/i18n'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'sw' : 'en')}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
      title={locale === 'en' ? 'Badilisha kwa Kiswahili' : 'Switch to English'}
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase font-bold text-xs">{locale === 'en' ? 'SW' : 'EN'}</span>
    </button>
  )
}
