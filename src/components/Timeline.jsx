import { useEffect, useMemo, useRef, useState } from 'react'
import { LocalizedText, LocalizedInline } from './LocalizedText.jsx'
import { MediaGallery } from './MediaGallery.jsx'
import {
  detectChronologyIssues,
  sortEventsChronologically,
} from '../data/sampleEvents.js'

export function Timeline({
  events,
  mode = 'year',
  categoryFilter = 'all',
  onFocus,
  onTagClick,
  initialFocusId,
  onSelectChange,
}) {
  const [focusedId, setFocusedId] = useState(initialFocusId ?? null)
  const focusedRef = useRef(null)

  const filtered = useMemo(() => {
    const base =
      categoryFilter === 'all'
        ? events
        : events.filter((e) => e.category === categoryFilter)
    return sortEventsChronologically(base)
  }, [events, categoryFilter])

  const warnings = useMemo(() => detectChronologyIssues(filtered), [filtered])

  const groups = useMemo(() => {
    const map = new Map()
    for (const e of filtered) {
      const key =
        mode === 'century' ? Math.floor(e.startYear / 100) * 100 : e.startYear
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(e)
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0])
  }, [filtered, mode])

  useEffect(() => {
    if (!focusedId || !focusedRef.current) return
    focusedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [focusedId])

  return (
    <div className="stack">
      {warnings.length > 0 && (
        <div
          className="surface glass-card"
          style={{
            padding: 'var(--space-lg)',
            color: '#f59e0b',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            background: 'rgba(245, 158, 11, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-sm)',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <h3
              className="heading small"
              style={{ margin: 0, color: '#f59e0b' }}
            >
              Kronoloji Uyarıları
            </h3>
          </div>
          {warnings.map((w, i) => (
            <div
              key={i}
              style={{
                padding: 'var(--space-sm)',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-xs)',
                fontSize: '0.875rem',
              }}
            >
              <strong>{w.type === 'order' ? 'Sıra Hatası' : 'Örtüşme'}</strong>:{' '}
              {w.a} ↔ {w.b}
            </div>
          ))}
        </div>
      )}
      <div className="stack-xl">
        {groups.map(([k, list]) => (
          <section key={k} className="stack">
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              <h2
                className="gradient-text heading underline-anim"
                style={{ margin: 0 }}
              >
                {mode === 'century' ? `${k}-${k + 99}` : k}
              </h2>
              <div
                className="tag"
                style={{
                  background: 'var(--gradient-accent)',
                  color: 'white',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                }}
              >
                {list.length} olay
              </div>
            </div>
            <div className="grid-responsive">
              {list.map((ev) => (
                <article
                  key={ev.id}
                  ref={focusedId === ev.id ? focusedRef : null}
                  className={`surface hoverable glass-card timeline-event ${
                    focusedId === ev.id ? 'focus-glow' : ''
                  }`}
                  data-event-id={ev.id}
                  style={{
                    padding: 'var(--space-lg)',
                    outline:
                      focusedId === ev.id
                        ? '2px solid var(--color-accent)'
                        : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Event Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-sm)',
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        onSelectChange?.(ev.id, e.target.checked)
                      }
                      aria-label="Seç"
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--color-accent)',
                      }}
                    />
                    <div
                      className="tag"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: 'var(--gradient-surface)',
                      }}
                    >
                      ID: {ev.id}
                    </div>
                  </div>

                  {/* Event Title and Date */}
                  <header
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 'var(--space-sm)',
                    }}
                  >
                    <h3
                      className="gradient-text heading small"
                      style={{
                        margin: 0,
                        lineHeight: '1.3',
                      }}
                    >
                      <LocalizedInline value={ev.title} />
                    </h3>
                    <div
                      className="tag"
                      style={{
                        background: 'var(--gradient-accent)',
                        color: 'white',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        minWidth: 'fit-content',
                      }}
                    >
                      {ev.startYear}
                      {ev.endYear && ev.endYear !== ev.startYear
                        ? `–${ev.endYear}`
                        : ''}
                    </div>
                  </header>

                  {/* Category */}
                  <div
                    className="muted"
                    style={{
                      marginBottom: 'var(--space-sm)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {ev.category}
                  </div>

                  {/* Media Gallery */}
                  <MediaGallery media={ev.media} />

                  {/* Description */}
                  <LocalizedText
                    as="p"
                    style={{
                      marginTop: 'var(--space-md)',
                      fontSize: '0.875rem',
                      lineHeight: '1.6',
                      color: 'var(--color-muted)',
                    }}
                    value={ev.description}
                  />

                  {/* Tags */}
                  {ev.tags?.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: 'var(--space-xs)',
                        flexWrap: 'wrap',
                        marginTop: 'var(--space-md)',
                      }}
                    >
                      {ev.tags.map((t) => (
                        <button
                          key={t}
                          className="tag"
                          onClick={() => onTagClick?.(t)}
                          style={{
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <footer
                    style={{
                      display: 'flex',
                      gap: 'var(--space-sm)',
                      marginTop: 'var(--space-lg)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      onClick={() => {
                        const newId = focusedId === ev.id ? null : ev.id
                        setFocusedId(newId)
                        onFocus?.(newId)
                      }}
                      style={{
                        padding: 'var(--space-xs) var(--space-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      {focusedId === ev.id ? '🎯 Odağı Kaldır' : '🎯 Odağı Aç'}
                    </button>
                    <PinButton eventId={ev.id} />
                    <button
                      onClick={() => onFocus?.(ev.id)}
                      aria-label="Detay"
                      style={{
                        padding: 'var(--space-xs) var(--space-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      📋 Detay
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function PinButton({ eventId }) {
  const [pinned, setPinned] = useState(() => {
    try {
      const raw = localStorage.getItem('pinned-events')
      if (!raw) return false
      const set = new Set(JSON.parse(raw))
      return set.has(eventId)
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pinned-events')
      const list = raw ? new Set(JSON.parse(raw)) : new Set()
      if (pinned) list.add(eventId)
      else list.delete(eventId)
      localStorage.setItem('pinned-events', JSON.stringify(Array.from(list)))
    } catch {}
  }, [pinned, eventId])

  return (
    <button
      onClick={() => setPinned((v) => !v)}
      className={pinned ? 'primary' : ''}
      style={{
        padding: 'var(--space-xs) var(--space-sm)',
        fontSize: '0.75rem',
        fontWeight: '600',
        background: pinned ? 'var(--gradient-accent)' : 'var(--glass-bg)',
        color: pinned ? 'white' : 'var(--color-fg)',
        border: pinned ? 'none' : '1px solid var(--glass-border)',
      }}
    >
      {pinned ? '📌 İğneli' : '📌 İğnele'}
    </button>
  )
}
