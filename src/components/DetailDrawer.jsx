import { useEffect } from 'react'
import { LocalizedText, LocalizedInline } from './LocalizedText.jsx'
import { MediaGallery } from './MediaGallery.jsx'

export function DetailDrawer({ open, event, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!open || !event) return null

  return (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-lg)',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Drawer Content */}
      <aside
        className="surface glass-card"
        style={{
          position: 'relative',
          width: 'min(600px, 100%)',
          maxHeight: '90vh',
          padding: 'var(--space-xl)',
          overflow: 'auto',
          animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            paddingBottom: 'var(--space-lg)',
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          <div style={{ flex: 1 }}>
            <h1
              className="gradient-text heading large"
              style={{
                margin: 0,
                marginBottom: 'var(--space-sm)',
                lineHeight: '1.2',
              }}
            >
              <LocalizedInline value={event.title} />
            </h1>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-sm)',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div
                className="tag"
                style={{
                  background: 'var(--gradient-accent)',
                  color: 'white',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                }}
              >
                {event.startYear}
                {event.endYear && event.endYear !== event.startYear
                  ? `–${event.endYear}`
                  : ''}
              </div>
              <div
                className="tag"
                style={{
                  background: 'var(--gradient-surface)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {event.category}
              </div>
              <div
                className="tag"
                style={{
                  background: 'var(--gradient-surface)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}
              >
                ID: {event.id}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            style={{
              padding: 'var(--space-sm)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              fontSize: '1.25rem',
              minWidth: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)'
              e.target.style.background = 'var(--gradient-accent)'
              e.target.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.background = 'var(--glass-bg)'
              e.target.style.color = 'var(--color-fg)'
            }}
          >
            ✕
          </button>
        </header>

        {/* Media Gallery */}
        <MediaGallery media={event.media} />

        {/* Description */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <h3
            className="gradient-text heading small"
            style={{
              margin: 0,
              marginBottom: 'var(--space-md)',
            }}
          >
            Açıklama
          </h3>
          <LocalizedText
            as="div"
            style={{
              fontSize: '1rem',
              lineHeight: '1.7',
              color: 'var(--color-muted)',
              background: 'var(--glass-bg)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--glass-border)',
            }}
            value={event.description}
          />
        </div>

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <h3
              className="gradient-text heading small"
              style={{
                margin: 0,
                marginBottom: 'var(--space-md)',
              }}
            >
              Etiketler
            </h3>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-sm)',
                flexWrap: 'wrap',
              }}
            >
              {event.tags.map((t) => (
                <button
                  key={t}
                  className="tag"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <footer
          style={{
            marginTop: 'var(--space-xl)',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            gap: 'var(--space-md)',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => {
              // Pin functionality could be added here
              console.log('Pin event:', event.id)
            }}
            style={{
              padding: 'var(--space-sm) var(--space-lg)',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            📌 İğnele
          </button>
          <button
            onClick={() => {
              // Share functionality could be added here
              console.log('Share event:', event.id)
            }}
            style={{
              padding: 'var(--space-sm) var(--space-lg)',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            🔗 Paylaş
          </button>
          <button
            onClick={() => {
              // Edit functionality could be added here
              console.log('Edit event:', event.id)
            }}
            className="primary"
            style={{
              padding: 'var(--space-sm) var(--space-lg)',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            ✏️ Düzenle
          </button>
        </footer>
      </aside>
    </div>
  )
}
