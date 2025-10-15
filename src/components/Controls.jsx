import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../context/I18nContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export function Controls({
  category,
  setCategory,
  mode,
  setMode,
  query,
  setQuery,
  onExportJson,
  onImportJson,
  selectedCount,
  onPrintSelected,
  onCreateEvent,
}) {
  const { t, locale, setLocale } = useI18n()
  const { theme, toggleTheme } = useTheme()

  const tabs = useMemo(
    () => [
      { key: 'all', label: t('tabs_all') },
      { key: 'political', label: t('tabs_political') },
      { key: 'cultural', label: t('tabs_cultural') },
      { key: 'military', label: t('tabs_military') },
      { key: 'pinned', label: 'İğnelenenler' },
    ],
    [t]
  )

  useEffect(() => {
    const url = new URL(window.location.href)
    if (category) url.searchParams.set('cat', category)
    if (mode) url.searchParams.set('mode', mode)
    if (query) url.searchParams.set('q', query)
    history.replaceState(null, '', url)
  }, [category, mode, query])

  return (
    <div className="stack controls-root">
      <header className="surface glass-card floating">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-lg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
            }}
          >
            <div
              className="gradient-text"
              style={{
                width: 12,
                height: 12,
                background: 'var(--gradient-accent)',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-glow)',
                animation: 'pulse 2s infinite',
              }}
            />
            <h1 className="gradient-text heading large">{t('appTitle')}</h1>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              alignItems: 'center',
            }}
          >
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="glass-card"
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              <option value="tr">🇹🇷 TR</option>
              <option value="en">🇺🇸 EN</option>
            </select>
            <button
              onClick={toggleTheme}
              className="glass-card"
              style={{
                padding: 'var(--space-sm)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1.25rem',
                minWidth: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      <div className="surface glass-card">
        <div
          style={{
            padding: 'var(--space-lg)',
            display: 'flex',
            gap: 'var(--space-sm)',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              flexWrap: 'wrap',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCategory(tab.key)}
                className={`tag ${category === tab.key ? 'active' : ''}`}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
                aria-pressed={category === tab.key}
                aria-current={category === tab.key ? 'true' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              alignItems: 'center',
              background: 'var(--glass-bg)',
              padding: 'var(--space-sm) var(--space-md)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              className="muted"
              style={{ fontSize: '0.75rem', fontWeight: '600' }}
            >
              {t('view_century')}
            </div>
            <label
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={mode === 'year'}
                onChange={() => setMode(mode === 'year' ? 'century' : 'year')}
                style={{ position: 'absolute', opacity: 0 }}
              />
              <span
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: '999px',
                  background:
                    mode === 'year'
                      ? 'var(--gradient-accent)'
                      : 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow:
                    mode === 'year'
                      ? 'var(--shadow-glow)'
                      : 'var(--glass-shadow)',
                }}
              >
                <span
                  style={{
                    transform: `translateX(${mode === 'year' ? 20 : 0}px)`,
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: mode === 'year' ? '#fff' : 'var(--color-muted)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                />
              </span>
            </label>
            <div
              className="muted"
              style={{ fontSize: '0.75rem', fontWeight: '600' }}
            >
              {t('view_year')}
            </div>
          </div>
        </div>
      </div>

      <div className="surface glass-card">
        <div
          style={{
            padding: 'var(--space-lg)',
            display: 'flex',
            gap: 'var(--space-md)',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              position: 'relative',
              flex: '1 1 320px',
              minWidth: '280px',
              maxWidth: '400px',
            }}
          >
            <input
              placeholder={t('search_placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-md) var(--space-md) var(--space-md) 48px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                fontWeight: '500',
                backdropFilter: 'blur(10px)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: 'var(--space-md)',
                transform: 'translateY(-50%)',
                color: 'var(--color-muted)',
                fontSize: '1.125rem',
              }}
            >
              🔍
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => {
                // Add print header for all events
                const printHeader = document.createElement('div')
                printHeader.className = 'print-header'
                printHeader.style.cssText = `
                  display: none;
                  text-align: center;
                  margin-bottom: 20pt;
                  font-size: 18pt;
                  font-weight: bold;
                  border-bottom: 2pt solid #000;
                  padding-bottom: 15pt;
                `
                printHeader.innerHTML = `
                  <h1>İnteraktif Zaman Çizelgesi</h1>
                  <h2>Tüm Olaylar</h2>
                  <p>Tarih: ${new Date().toLocaleDateString('tr-TR')}</p>
                `
                document.body.insertBefore(
                  printHeader,
                  document.body.firstChild
                )

                // Show print header in print mode
                const style = document.createElement('style')
                style.textContent = `
                  @media print {
                    .print-header { display: block !important; }
                  }
                `
                document.head.appendChild(style)

                window.print()

                // Cleanup
                setTimeout(() => {
                  printHeader.remove()
                  style.remove()
                }, 1000)
              }}
              className="primary"
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              📄 {t('export_pdf')}
            </button>
            <button
              onClick={onCreateEvent}
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              ✨ Yeni Olay
            </button>
            <button
              onClick={onExportJson}
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              📤 JSON Dışa Aktar
            </button>
            <label style={{ display: 'inline-block' }}>
              <input
                type="file"
                accept="application/json"
                onChange={onImportJson}
                style={{ display: 'none' }}
              />
              <span
                className="tag"
                style={{
                  cursor: 'pointer',
                  padding: 'var(--space-sm) var(--space-md)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
              >
                📥 JSON İçe Aktar
              </span>
            </label>
            <button
              disabled={!selectedCount}
              onClick={onPrintSelected}
              aria-disabled={!selectedCount}
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                fontSize: '0.875rem',
                fontWeight: '600',
                opacity: selectedCount ? 1 : 0.5,
                cursor: selectedCount ? 'pointer' : 'not-allowed',
              }}
            >
              🖨️ Seçiliyi Yazdır ({selectedCount || 0})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
