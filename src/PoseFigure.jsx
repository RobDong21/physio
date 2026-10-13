/** Simple silhouette cues — flip with CSS when mirrored. */

export function PoseFigure({ pose, direction, side, mirrored }) {
  const flip = mirrored ? 'pose-figure--mirrored' : ''

  return (
    <div className={`pose-figure ${flip}`} aria-hidden="true">
      <svg viewBox="0 0 200 240" className="pose-svg">
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a6b5c" />
            <stop offset="100%" stopColor="#0f3d36" />
          </linearGradient>
        </defs>

        {/* torso */}
        <ellipse cx="100" cy="175" rx="42" ry="48" fill="url(#bodyGrad)" opacity="0.9" />
        {/* neck */}
        <rect x="90" y="108" width="20" height="28" rx="8" fill="#1a6b5c" />
        {/* head — position shifts by pose */}
        {renderHead(pose, direction, side)}
        {/* arms for nerve glide / isometric */}
        {renderArms(pose, direction, side)}
      </svg>
      <p className="pose-caption">{caption(pose, direction, side, mirrored)}</p>
    </div>
  )
}

function renderHead(pose, direction, side) {
  let cx = 100
  let cy = 78
  let rotate = 0

  if (pose === 'chinTuck') {
    cx = 96
    cy = 80
  } else if (pose === 'extension') {
    cy = 72
    rotate = -18
  } else if (pose === 'lateralFlexion') {
    const toward = side === 'left' ? -1 : 1
    cx = 100 + toward * 14
    rotate = toward * 22
  } else if (pose === 'isometric' && (direction === 'left' || direction === 'right')) {
    // slight lean into resistance
    const toward = direction === 'left' ? -1 : 1
    cx = 100 + toward * 4
  }

  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`}>
      <circle cx={cx} cy={cy} r="28" fill="#243b36" />
      <circle cx={cx - 8} cy={cy - 2} r="3" fill="#c8e6df" />
      <circle cx={cx + 8} cy={cy - 2} r="3" fill="#c8e6df" />
      {pose === 'chinTuck' && (
        <path
          d={`M ${cx - 10} ${cy + 10} Q ${cx} ${cy + 18} ${cx + 10} ${cy + 10}`}
          stroke="#7ec8b8"
          strokeWidth="2"
          fill="none"
        />
      )}
    </g>
  )
}

function renderArms(pose, direction, side) {
  if (pose === 'isometric') {
    // hand on head
    const hand =
      direction === 'front'
        ? { x: 100, y: 48 }
        : direction === 'back'
          ? { x: 100, y: 48 }
          : direction === 'left'
            ? { x: 62, y: 78 }
            : { x: 138, y: 78 }

    return (
      <>
        <circle cx={hand.x} cy={hand.y} r="12" fill="#2d8a76" opacity="0.85" />
        <text x={hand.x} y={hand.y + 4} textAnchor="middle" fontSize="10" fill="#e8f7f3">
          push
        </text>
      </>
    )
  }

  if (pose === 'nerveGlide') {
    const armSide = side === 'left' ? -1 : 1
    const x1 = 100
    const y1 = 140
    const x2 = 100 + armSide * 70
    const y2 = 120
    return (
      <>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#2d8a76"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx={x2} cy={y2} r="10" fill="#1a6b5c" />
      </>
    )
  }

  if (pose === 'lateralFlexion') {
    const toward = side === 'left' ? -1 : 1
    return (
      <path
        d={`M ${100 - toward * 30} 160 Q ${100 - toward * 50} 100 ${100 + toward * 20} 70`}
        stroke="#7ec8b8"
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 4"
        opacity="0.7"
      />
    )
  }

  return null
}

function caption(pose, direction, side, mirrored) {
  const flip = (s) => {
    if (!mirrored || !s) return s
    if (s === 'left') return 'right'
    if (s === 'right') return 'left'
    return s
  }

  const s = flip(side)
  const d = flip(direction)

  switch (pose) {
    case 'chinTuck':
      return 'Chin straight back'
    case 'extension':
      return 'Look gently up'
    case 'lateralFlexion':
      return s ? `Ear to ${s} shoulder` : 'Side bend'
    case 'isometric':
      return d ? `Press ${d}` : 'Hold still'
    case 'nerveGlide':
      return s ? `${s[0].toUpperCase()}${s.slice(1)} arm glide` : 'Nerve glide'
    default:
      return ''
  }
}
