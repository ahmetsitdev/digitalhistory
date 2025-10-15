export function PrintTOC({ groups }) {
  if (!groups || groups.length === 0) return null
  return (
    <div className="only-print toc" style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>İçindekiler</h2>
      <ol>
        {groups.map(([title, list]) => (
          <li key={title}>
            {title} — {list.length} olay
          </li>
        ))}
      </ol>
    </div>
  )
}
