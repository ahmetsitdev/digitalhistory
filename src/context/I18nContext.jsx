import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const messages = {
  tr: {
    appTitle: 'İnteraktif Zaman Çizelgesi',
    tabs_all: 'Tümü',
    tabs_political: 'Siyasal',
    tabs_cultural: 'Kültürel',
    tabs_military: 'Askerî',
    view_century: 'Yüzyıl',
    view_year: 'Yıl',
    search_placeholder: 'Olay veya etiket ara…',
    export_pdf: 'PDF Dışa Aktar',
    theme: 'Tema',
  },
  en: {
    appTitle: 'Interactive Timeline',
    tabs_all: 'All',
    tabs_political: 'Political',
    tabs_cultural: 'Cultural',
    tabs_military: 'Military',
    view_century: 'Century',
    view_year: 'Year',
    search_placeholder: 'Search event or tag…',
    export_pdf: 'Export PDF',
    theme: 'Theme',
  },
}

const I18nContext = createContext({
  locale: 'tr',
  t: (k) => k,
  setLocale: () => {},
})

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    const saved = localStorage.getItem('app-locale')
    if (saved === 'tr' || saved === 'en') return saved
    const nav = navigator.language?.toLowerCase?.() || 'tr'
    return nav.startsWith('tr') ? 'tr' : 'en'
  })

  useEffect(() => {
    localStorage.setItem('app-locale', locale)
  }, [locale])

  const t = useMemo(() => {
    const dict = messages[locale] || messages.tr
    return (key) => dict[key] ?? key
  }, [locale])

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
