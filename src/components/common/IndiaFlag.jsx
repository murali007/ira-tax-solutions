export default function IndiaFlag({ width = 18, height = 12, className = '' }) {
  return (
    <svg
      className={`india-flag-svg ${className}`}
      width={width}
      height={height}
      viewBox="0 0 900 600"
      aria-label="India Flag"
      role="img"
      style={{
        display: 'inline-block',
        verticalAlign: '-1px',
        borderRadius: '2px',
        overflow: 'hidden',
        boxShadow: '0 0 2px rgba(0,0,0,0.3)',
        flexShrink: 0,
      }}
    >
      <rect width="900" height="600" fill="#138808" />
      <rect width="900" height="400" fill="#FFFFFF" />
      <rect width="900" height="200" fill="#FF9933" />
      <circle cx="450" cy="300" r="80" fill="none" stroke="#000080" strokeWidth="8" />
      <circle cx="450" cy="300" r="16" fill="#000080" />
      {Array.from({ length: 24 }).map((_, i) => {
        const rad = (i * 15 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1="450"
            y1="300"
            x2={450 + 80 * Math.cos(rad)}
            y2={300 + 80 * Math.sin(rad)}
            stroke="#000080"
            strokeWidth="5"
          />
        );
      })}
    </svg>
  );
}
