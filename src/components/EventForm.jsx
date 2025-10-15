import { useState, useEffect } from 'react'
import { categories } from '../data/sampleEvents.js'
import { LocalizedText } from './LocalizedText.jsx'

export function EventForm({ open, initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      id: `evt-${Math.random().toString(36).slice(2, 8)}`,
      title: { tr: '', en: '' },
      startYear: 0,
      endYear: 0,
      category: categories.political,
      tags: [],
      description: { tr: '', en: '' },
      media: [],
    }
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = 'unset'
    }
  }, [open, onCancel])

  const set = (path, value) => setForm((f) => ({ ...f, [path]: value }))
  const setNested = (obj, key, value) =>
    setForm((f) => ({ ...f, [obj]: { ...(f[obj] || {}), [key]: value } }))

  if (!open) return null

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
        onClick={onCancel}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Modal Content */}
      <div
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
            alignItems: 'center',
            marginBottom: 'var(--space-lg)',
            paddingBottom: 'var(--space-lg)',
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          <h2 className="gradient-text heading large" style={{ margin: 0 }}>
            Yeni Olay Ekle
          </h2>
          <button
            onClick={onCancel}
            aria-label="Kapat"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              color: 'var(--color-fg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--color-danger)'
              e.target.style.color = 'white'
              e.target.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--glass-bg)'
              e.target.style.color = 'var(--color-fg)'
              e.target.style.transform = 'scale(1)'
            }}
          >
            ✕
          </button>
        </header>

        <div className="stack">
          {/* Title Fields */}
          <div
            className="grid-responsive"
            style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
          >
            <label>
              <div className="muted">Başlık (TR)</div>
              <input
                value={form.title.tr || ''}
                onChange={(e) => setNested('title', 'tr', e.target.value)}
                placeholder="Türkçe başlık..."
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                  color: 'var(--color-fg)',
                }}
              />
            </label>
            <label>
              <div className="muted">Title (EN)</div>
              <input
                value={form.title.en || ''}
                onChange={(e) => setNested('title', 'en', e.target.value)}
                placeholder="English title..."
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                  color: 'var(--color-fg)',
                }}
              />
            </label>
          </div>

          {/* Date and Category Fields */}
          <div
            className="grid-responsive"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
          >
            <label>
              <div className="muted">Başlangıç Yılı</div>
              <input
                type="number"
                value={form.startYear}
                onChange={(e) => set('startYear', Number(e.target.value))}
                placeholder="2024"
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                  color: 'var(--color-fg)',
                }}
              />
            </label>
            <label>
              <div className="muted">Bitiş Yılı</div>
              <input
                type="number"
                value={form.endYear}
                onChange={(e) => set('endYear', Number(e.target.value))}
                placeholder="2025"
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                  color: 'var(--color-fg)',
                }}
              />
            </label>
            <label>
              <div className="muted">Kategori</div>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                  color: 'var(--color-fg)',
                }}
              >
                <option value={categories.political}>Siyasal</option>
                <option value={categories.cultural}>Kültürel</option>
                <option value={categories.military}>Askerî</option>
              </select>
            </label>
          </div>

          {/* Tags Field */}
          <label>
            <div className="muted">Etiketler (virgülle ayırın)</div>
            <input
              value={form.tags.join(', ')}
              onChange={(e) =>
                set(
                  'tags',
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              placeholder="tarih, önemli, siyaset..."
              style={{
                width: '100%',
                padding: 'var(--space-sm)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                color: 'var(--color-fg)',
              }}
            />
          </label>

          {/* Description Fields */}
          <div
            className="grid-responsive"
            style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
          >
            <label>
              <div className="muted">Açıklama (TR)</div>
              <textarea
                rows={4}
                value={form.description.tr || ''}
                onChange={(e) => setNested('description', 'tr', e.target.value)}
                placeholder="Türkçe açıklama..."
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                  color: 'var(--color-fg)',
                  resize: 'vertical',
                }}
              />
            </label>
            <label>
              <div className="muted">Description (EN)</div>
              <textarea
                rows={4}
                value={form.description.en || ''}
                onChange={(e) => setNested('description', 'en', e.target.value)}
                placeholder="English description..."
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                  color: 'var(--color-fg)',
                  resize: 'vertical',
                }}
              />
            </label>
          </div>

          {/* Media Section */}
          <div>
            <div className="muted">Görsel URL (image)</div>
            <MediaInput form={form} setForm={setForm} />
          </div>

          {/* Footer Actions */}
          <footer
            style={{
              marginTop: 'var(--space-xl)',
              paddingTop: 'var(--space-lg)',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              gap: 'var(--space-md)',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={onCancel}
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                fontSize: '0.875rem',
                fontWeight: '600',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                color: 'var(--color-fg)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              İptal
            </button>
            <button
              onClick={() => onSave?.(form)}
              className="primary"
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                fontSize: '0.875rem',
                fontWeight: '600',
                borderRadius: 'var(--radius-md)',
              }}
            >
              💾 Kaydet
            </button>
          </footer>
        </div>
      </div>
    </div>
  )
}

function MediaInput({ form, setForm }) {
  const addImg = (src) =>
    setForm((f) => ({
      ...f,
      media: [...(f.media || []), { type: 'image', src }],
    }))
  const removeAt = (i) =>
    setForm((f) => ({ ...f, media: f.media.filter((_, idx) => idx !== i) }))
  const [url, setUrl] = useState('')

  return (
    <div className="stack">
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <input
          placeholder="https://example.com/image.jpg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            flex: 1,
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)',
            color: 'var(--color-fg)',
          }}
        />
        <button
          onClick={() => {
            if (url) {
              addImg(url)
              setUrl('')
            }
          }}
          className="primary"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            fontSize: '0.875rem',
            fontWeight: '600',
            borderRadius: 'var(--radius-md)',
          }}
        >
          ➕ Ekle
        </button>
      </div>
      {(form.media || []).length > 0 && (
        <div
          style={{
            display: 'grid',
            gap: 'var(--space-sm)',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            marginTop: 'var(--space-sm)',
          }}
        >
          {form.media.map((m, i) => (
            <div
              key={i}
              className="surface glass-card"
              style={{
                padding: 'var(--space-sm)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <img
                src={m.src}
                alt=""
                style={{
                  height: 80,
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-xs)',
                }}
              />
              <button
                onClick={() => removeAt(i)}
                style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-danger)',
                  background: 'var(--color-danger)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--color-danger-600)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--color-danger)'
                }}
              >
                🗑️ Sil
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
