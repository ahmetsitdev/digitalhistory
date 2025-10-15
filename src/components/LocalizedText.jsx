import { useI18n } from '../context/I18nContext.jsx'

export function LocalizedText({ value, fallback = '', as: Tag = 'p', style }) {
  const { locale } = useI18n()
  if (value == null) return null
  if (typeof value === 'string') return <Tag style={style}>{value}</Tag>
  const text = value[locale] ?? value.tr ?? value.en ?? fallback
  return <Tag style={style}>{text}</Tag>
}

export function LocalizedInline({ value, fallback = '' }) {
  const { locale } = useI18n()
  if (value == null) return null
  if (typeof value === 'string') return <>{value}</>
  const text = value[locale] ?? value.tr ?? value.en ?? fallback
  return <>{text}</>
}
