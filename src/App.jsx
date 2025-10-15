import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { events as initialEvents } from './data/sampleEvents.js'
import { Timeline } from './components/Timeline.jsx'
import { Controls } from './components/Controls.jsx'
import { DetailDrawer } from './components/DetailDrawer.jsx'
import { SkeletonList } from './components/SkeletonList.jsx'
import { EventForm } from './components/EventForm.jsx'
import { MapAnnotations } from './components/MapAnnotations.jsx'
import { PrintTOC } from './components/PrintTOC.jsx'

// Utility functions
const exportToJson = (userEvents) => {
  const blob = new Blob([JSON.stringify(userEvents, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'events.json'
  a.click()
  URL.revokeObjectURL(url)
}

const importFromJson = (e, setUserEvents) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result)
      if (Array.isArray(data)) setUserEvents(data)
    } catch {}
  }
  reader.readAsText(file)
  e.target.value = ''
}

const createPrintHeader = (title, subtitle) => {
  const printHeader = document.createElement('div')
  printHeader.className = 'print-header'
  printHeader.style.cssText = `
    display: none;
    text-align: center;
    margin-bottom: 20pt;
    font-size: 16pt;
    font-weight: bold;
    border-bottom: 2pt solid #000;
    padding-bottom: 10pt;
  `
  printHeader.innerHTML = `
    <h1>${title}</h1>
    <p>${subtitle}</p>
    <p>Tarih: ${new Date().toLocaleDateString('tr-TR')}</p>
  `
  document.body.insertBefore(printHeader, document.body.firstChild)
  return printHeader
}

const setupPrintStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    @media print {
      .print-header { display: block !important; }
    }
  `
  document.head.appendChild(style)
  return style
}

const cleanupPrint = (printHeader, style) => {
  setTimeout(() => {
    document.querySelectorAll('.timeline-event').forEach((el) => {
      el.classList.remove('print-hidden')
    })
    printHeader.remove()
    style.remove()
  }, 1000)
}

function App() {
  const [category, setCategory] = useState('all')
  const [mode, setMode] = useState('year')
  const [query, setQuery] = useState('')
  const [focusId, setFocusId] = useState(null)
  const [drawerEvent, setDrawerEvent] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [userEvents, setUserEvents] = useState(initialEvents)
  const [selectedIds, setSelectedIds] = useState(() => new Set())

  useEffect(() => {
    const url = new URL(window.location.href)
    const cat = url.searchParams.get('cat')
    const md = url.searchParams.get('mode')
    const q = url.searchParams.get('q')
    const f = url.searchParams.get('focus')
    if (cat) setCategory(cat)
    if (md) setMode(md)
    if (q) setQuery(q)
    if (f) setFocusId(f)
  }, [])

  const filteredByQuery = useMemo(() => {
    if (!query) return userEvents
    const ql = query.toLowerCase()
    return userEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(ql) ||
        e.description?.toLowerCase().includes(ql) ||
        e.tags?.some((t) => t.toLowerCase().includes(ql))
    )
  }, [query, userEvents])

  const filteredWithPinned = useMemo(() => {
    if (category !== 'pinned') return filteredByQuery
    try {
      const raw = localStorage.getItem('pinned-events')
      const set = new Set(raw ? JSON.parse(raw) : [])
      return filteredByQuery.filter((e) => set.has(e.id))
    } catch {
      return filteredByQuery
    }
  }, [filteredByQuery, category])

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const id = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(id)
  }, [category, mode, query])

  return (
    <div className="container stack">
      <Controls
        category={category}
        setCategory={setCategory}
        mode={mode}
        setMode={setMode}
        query={query}
        setQuery={setQuery}
        onExportJson={() => exportToJson(userEvents)}
        onImportJson={(e) => importFromJson(e, setUserEvents)}
        selectedCount={selectedIds.size}
        onPrintSelected={() => {
          // Hide all timeline events first
          document.querySelectorAll('.timeline-event').forEach((el) => {
            el.classList.add('print-hidden')
          })

          // Show only selected events
          document.querySelectorAll('.timeline-event').forEach((el) => {
            const eventId = el.getAttribute('data-event-id')
            if (eventId && selectedIds.has(eventId)) {
              el.classList.remove('print-hidden')
            }
          })

          const printHeader = createPrintHeader(
            'Seçili Olaylar',
            `${selectedIds.size} Adet`
          )
          const style = setupPrintStyles()

          window.print()
          cleanupPrint(printHeader, style)
        }}
        onCreateEvent={() => setEditorOpen(true)}
      />

      {loading ? (
        <SkeletonList count={8} />
      ) : (
        <>
          <PrintTOC
            groups={(() => {
              const map = new Map()
              for (const e of filteredWithPinned) {
                const start = e.startYear
                const key =
                  mode === 'century'
                    ? `${Math.floor(start / 100) * 100}-${
                        Math.floor(start / 100) * 100 + 99
                      }`
                    : String(start)
                if (!map.has(key)) map.set(key, [])
                map.get(key).push(e)
              }
              return Array.from(map.entries())
            })()}
          />
          <Timeline
            events={filteredWithPinned}
            mode={mode}
            categoryFilter={category === 'pinned' ? 'all' : category}
            initialFocusId={focusId}
            onTagClick={(tag) => setQuery(tag)}
            onFocus={(id) => {
              setFocusId(id)
              const url = new URL(window.location.href)
              if (id) url.searchParams.set('focus', id)
              else url.searchParams.delete('focus')
              history.replaceState(null, '', url)
              const found = filteredWithPinned.find((e) => e.id === id)
              if (found) setDrawerEvent(found)
            }}
            onSelectChange={(id, checked) => {
              setSelectedIds((prev) => {
                const next = new Set(prev)
                if (checked) next.add(id)
                else next.delete(id)
                return next
              })
            }}
          />
          {drawerEvent && (
            <DetailDrawer
              open={!!drawerEvent}
              event={drawerEvent}
              onClose={() => setDrawerEvent(null)}
            />
          )}
          <EventForm
            open={editorOpen}
            initial={null}
            onSave={(ev) => {
              setUserEvents((list) => [...list, ev])
              setEditorOpen(false)
            }}
            onCancel={() => setEditorOpen(false)}
          />
          <MapAnnotations />
        </>
      )}
    </div>
  )
}

export default App
