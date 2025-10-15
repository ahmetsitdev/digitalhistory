import { useEffect, useMemo, useRef, useState } from 'react'

export function MapAnnotations() {
  const containerRef = useRef(null)
  const [pins, setPins] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('map-pins')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('map-pins', JSON.stringify(pins))
    } catch {}
  }, [pins])

  const addPin = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPins((p) => [...p, { id: crypto.randomUUID(), x, y, label: '' }])
  }

  const dragPin = (id, e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPins((list) => list.map((p) => (p.id === id ? { ...p, x, y } : p)))
  }

  return (
    <div className="surface" style={{ padding: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <div className="heading">Harita Anotasyonları</div>
        <button onClick={() => setPins([])}>Temizle</button>
      </div>
      <div
        ref={containerRef}
        onClick={addPin}
        style={{
          height: 280,
          background: 'linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)',
          position: 'relative',
          borderRadius: 12,
          overflow: 'hidden',
          cursor: 'crosshair',
        }}
      >
        {pins.map((p) => (
          <Pin key={p.id} pin={p} onDrag={dragPin} />
        ))}
      </div>
    </div>
  )
}

function Pin({ pin, onDrag }) {
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const move = (e) => dragging && onDrag(pin.id, e)
    const up = () => setDragging(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
  }, [dragging, onDrag, pin.id])

  return (
    <div
      onMouseDown={() => setDragging(true)}
      style={{
        position: 'absolute',
        left: `${pin.x}%`,
        top: `${pin.y}%`,
        transform: 'translate(-50%, -50%)',
        background: 'var(--color-elev)',
        border: 'var(--border)',
        color: 'var(--color-fg)',
        borderRadius: 999,
        padding: '4px 6px',
        display: 'inline-flex',
        gap: 6,
        alignItems: 'center',
        cursor: 'grab',
        boxShadow: '0 6px 16px rgba(0,0,0,.2)',
      }}
    >
      <span>📍</span>
      <input
        placeholder="etiket"
        value={pin.label || ''}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => (pin.label = e.target.value)}
        style={{
          border: 'none',
          background: 'transparent',
          color: 'inherit',
          outline: 'none',
        }}
      />
    </div>
  )
}
