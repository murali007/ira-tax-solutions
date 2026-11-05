export default function UsFlag({ width = 18, height = 12, className = '' }) {
  // 9 rows of alternating 6 and 5 star positions
  const stars = [];
  const xStep = 2964 / 12;
  const yStep = 2100 / 10;
  for (let r = 1; r <= 9; r++) {
    const isOdd = r % 2 !== 0;
    const cols = isOdd ? [1, 3, 5, 7, 9, 11] : [2, 4, 6, 8, 10];
    for (const c of cols) {
      stars.push({ x: c * xStep, y: r * yStep });
    }
  }

  return (
    <svg
      className={`us-flag-svg ${className}`}
      width={width}
      height={height}
      viewBox="0 0 7410 3900"
      aria-label="United States Flag"
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
      {/* 13 red and white stripes */}
      <rect width="7410" height="3900" fill="#b22234" />
      <path
        d="M0,450H7410M0,1050H7410M0,1650H7410M0,2250H7410M0,2850H7410M0,3450H7410"
        stroke="#ffffff"
        strokeWidth="300"
      />
      {/* Blue Canton */}
      <rect width="2964" height="2100" fill="#3c3b6e" />
      {/* 50 Stars */}
      <g fill="#ffffff">
        {stars.map((pos, i) => (
          <circle key={i} cx={pos.x} cy={pos.y} r={55} />
        ))}
      </g>
    </svg>
  );
}
