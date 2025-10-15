export function SkeletonList({ count = 6 }) {
  return (
    <div className="grid-responsive">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="surface hoverable col-12 col-sm-6 col-md-4 col-lg-3"
          style={{ padding: 16 }}
        >
          <div className="skeleton" style={{ padding: 12 }}>
            <div className="sk-line" style={{ width: '60%' }} />
            <div className="sk-gap" />
            <div className="sk-line" style={{ width: '30%' }} />
            <div className="sk-gap" />
            <div className="sk-line" style={{ width: '90%' }} />
            <div className="sk-gap" />
            <div className="sk-line" style={{ width: '80%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
