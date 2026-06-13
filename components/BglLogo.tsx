// Logo BGL BNP Paribas — reproduction vectorielle (carré vert + courbe d'étoiles
// + wordmark « BGL / BNP PARIBAS »). textColor permet une version sombre (#111,
// page blanche) ou inversée (#fff, header sombre).

function star(cx: number, cy: number, R: number, rot: number): string {
  const ir = R * 0.34
  const pts: [number, number][] = []
  for (let i = 0; i < 4; i++) {
    const ao = ((rot + i * 90 - 90) * Math.PI) / 180
    pts.push([cx + R * Math.cos(ao), cy + R * Math.sin(ao)])
    const ai = ((rot + i * 90 - 45) * Math.PI) / 180
    pts.push([cx + ir * Math.cos(ai), cy + ir * Math.sin(ai)])
  }
  return 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L') + 'Z'
}

// 4 étoiles décroissantes en arc (la « courbe » BNP Paribas).
const STARS: [number, number, number, number][] = [
  [76, 31, 22, -18],
  [44, 46, 16, -14],
  [37, 78, 12.5, -8],
  [64, 93, 10, -2],
]

export default function BglLogo({ height = 40, textColor = '#111111' }: { height?: number; textColor?: string }) {
  return (
    <svg
      height={height}
      viewBox="0 0 486 124"
      role="img"
      aria-label="BGL BNP Paribas"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="bglIconGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4FA862" />
          <stop offset="0.55" stopColor="#1C9150" />
          <stop offset="1" stopColor="#00723E" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="120" height="120" rx="18" fill="url(#bglIconGrad)" />
      {STARS.map((s, i) => (
        <path key={i} d={star(s[0], s[1], s[2], s[3])} fill="#ffffff" />
      ))}
      <text
        x="140"
        y="56"
        fill={textColor}
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="58"
        letterSpacing="-1"
      >
        BGL
      </text>
      <text
        x="140"
        y="113"
        fill={textColor}
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="45"
        letterSpacing="-1"
      >
        BNP PARIBAS
      </text>
    </svg>
  )
}
