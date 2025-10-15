import { useState } from 'react'

export function MediaGallery({ media = [] }) {
  const images = media.filter((m) => m.type === 'image')
  const [idx, setIdx] = useState(0)
  if (images.length === 0) return null
  const current = images[Math.min(idx, images.length - 1)]
  return (
    <div className="stack-sm" style={{ marginTop: 'var(--space-sm)' }}>
      <div
        className="surface glass-card"
        style={{
          padding: 'var(--space-sm)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <img
          src={current.src}
          alt=""
          style={{
            width: '100%',
            borderRadius: 'var(--radius-md)',
            display: 'block',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        />
      </div>
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            overflowX: 'auto',
            paddingBottom: 'var(--space-xs)',
          }}
        >
          {images.map((m, i) => (
            <button
              key={i}
              className="surface glass-card"
              style={{
                padding: 'var(--space-xs)',
                borderColor:
                  i === idx ? 'var(--color-accent)' : 'var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                minWidth: 'fit-content',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onClick={() => setIdx(i)}
            >
              <img
                src={m.src}
                alt=""
                style={{
                  height: 48,
                  width: 72,
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  display: 'block',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
