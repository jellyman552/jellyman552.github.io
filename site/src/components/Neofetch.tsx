import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

// ASCII jellyfish sprite: bobs, waves its tentacles and blinks now and then.
const BODY = ['    .-"""""-.', '   /  o   o  \\', '  |     u     |', '   \\.-.-.-.-./']
const BLINK = '   /  -   -  \\'
const TENTACLES = [
  ['    ) ( ) ( )', '   ( ) ( ) (', '    ) ( ) ( )'],
  ['   ( ) ( ) (', '    ) ( ) ( )', '   ( ) ( ) ('],
]
const SEQ = [
  { t: 0, y: 0 },
  { t: 1, y: 0 },
  { t: 0, y: 1 },
  { t: 1, y: 1 },
  { t: 0, y: 1, blink: true },
  { t: 1, y: 0 },
]
const HEIGHT = BODY.length + 3 + 1
const frame = ({ t, y, blink }: { t: number; y: number; blink?: boolean }) => {
  const body = blink ? [BODY[0], BLINK, BODY[2], BODY[3]] : BODY
  const lines = [...Array(y).fill(''), ...body, ...TENTACLES[t]]
  while (lines.length < HEIGHT) lines.push('')
  return lines.join('\n')
}

function Jelly() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((x) => (x + 1) % SEQ.length), 380)
    return () => clearInterval(id)
  }, [])
  return (
    <pre aria-hidden className="ascii shrink-0 text-[13px] leading-[1.2] text-accent glow">
      {frame(SEQ[i])}
    </pre>
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
