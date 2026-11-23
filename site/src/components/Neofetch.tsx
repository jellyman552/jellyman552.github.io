import { profile } from '../data/profile'

const LOGO = [
  '    ███ ███   ██',
  '    ███ ████  ██',
  '    ███ ██ ██ ██',
  '██  ███ ██  ████',
  ' ██████ ██   ███',
].join('\n')

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

const swatches = ['bg-accent', 'bg-ok', 'bg-warn', 'bg-[#f472b6]', 'bg-[#a78bfa]', 'bg-muted', 'bg-text']

export function Neofetch() {
  return (
    <figure
      aria-label="System info, neofetch style"
      className="rounded-lg border border-line bg-surface p-5 text-[13px] leading-relaxed shadow-[0_0_40px_-12px_rgba(3,215,252,0.25)] sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
        <pre aria-hidden className="ascii shrink-0 text-[11px] leading-[1.05] text-accent glow sm:text-[12px]">
          {LOGO}
        </pre>
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
          <div aria-hidden className="mt-3 flex gap-0">
            {swatches.map((c) => (
              <span key={c} className={`h-3.5 w-6 ${c}`} />
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}
