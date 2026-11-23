import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

// Pixel-art jellyfish: each character is one pixel. It bobs, waves its
// tentacles and blinks now and then. Drawn as SVG rects so pixels stay crisp.
// . empty  X body  L highlight  E eye  T tentacle
const DOME = [
  '....XXXXXX....',
  '..XXXXXXXXXX..',
  '.XXLLXXXXXXXX.',
  '.XLLXXXXXXXXX.',
  'XXXXEXXXXEXXXX',
  'XXXXEXXXXEXXXX',
  'XXXXXXXXXXXXXX',
  '.XX.XXX.XXX.X.',
]
const BLINK_ROW = 'XXXXXXXXXXXXXX'
const WAVES = [
  ['..T..T..T..T..', '.T..T..T..T...', '..T..T..T..T..', '.T..T..T..T...'],
  ['.T..T..T..T...', '..T..T..T..T..', '.T..T..T..T...', '..T..T..T..T..'],
]
const SEQ = [
  { t: 0, y: 0 },
  { t: 1, y: 0 },
  { t: 0, y: 1 },
  { t: 1, y: 1 },
  { t: 0, y: 1, blink: true },
  { t: 1, y: 0 },
]
const PX = 7
const W = DOME[0].length
const H = DOME.length + WAVES[0].length + 1 // +1 row of bob room
const FILL: Record<string, string> = {
  X: 'var(--color-accent)',
  L: 'var(--color-accent-strong)',
  E: 'var(--color-surface)',
  T: '#04acc9',
}

function Jelly() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((x) => (x + 1) % SEQ.length), 380)
    return () => clearInterval(id)
  }, [])
  const f = SEQ[i]
  const rows = [...DOME, ...WAVES[f.t]]
  if (f.blink) rows[4] = BLINK_ROW
  return (
    <svg
      aria-hidden
      width={W * PX}
      height={H * PX}
      viewBox={`0 0 ${W} ${H}`}
      shapeRendering="crispEdges"
      className="shrink-0 self-start drop-shadow-[0_0_10px_rgba(3,215,252,0.45)]"
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) => (c === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y + f.y} width={1} height={1} fill={FILL[c]} />)),
      )}
    </svg>
  )
}

const years = new Date().getFullYear() - 2023

const rows: [string, string][] = [
  ['OS', 'Full-stack developer'],
  ['Host', profile.location],
  ['Uptime', `${years}+ yrs shipping software`],
  ['Shell', 'Python · TypeScript · SQL'],
  ['Backend', 'Flask · FastAPI · Node.js'],
  ['Frontend', 'React · Vite · Tailwind'],
  ['Infra', 'Docker · Caddy · OCI · AWS'],
  ['Education', 'UCSD B.S. Chem · CS50P'],
  ['Status', 'open to roles + freelance'],
]

export function Neofetch() {
  return (
    <figure
      aria-label="System info, neofetch style"
      className="rounded-lg border border-line bg-surface p-5 text-[13px] leading-relaxed shadow-[0_0_40px_-12px_rgba(3,215,252,0.25)] sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
        <Jelly />
        <div className="min-w-0">
          <p className="font-bold">
            <span className="text-accent">jagger</span>
            <span className="text-faint">@</span>
            <span className="text-accent">portfolio</span>
          </p>
          <p aria-hidden className="text-faint">
            ────────────────
          </p>
          <dl className="mt-1 grid grid-cols-[5.5rem_1fr] gap-x-2">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="font-bold text-accent">{k}</dt>
                <dd className="text-text">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </figure>
  )
}
