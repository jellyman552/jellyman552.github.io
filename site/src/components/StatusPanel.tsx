import { useEffect, useState } from 'react'
import { demoProjects } from '../data/projects'
import { Link } from '../router'

type State = { kind: 'pending' } | { kind: 'up'; ms: number } | { kind: 'down' } | { kind: 'undeployed' }

/** Reachability check from the visitor's browser. `no-cors` gives an opaque
 * response, which is enough: it resolves when the server answers and rejects
 * on network errors. */
async function probe(url: string): Promise<State> {
  const t0 = performance.now()
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 6000)
  try {
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal })
    return { kind: 'up', ms: Math.round(performance.now() - t0) }
  } catch {
    return { kind: 'down' }
  } finally {
    clearTimeout(timer)
  }
}

const LABEL: Record<State['kind'], [string, string, string]> = {
  // [dot color, state text, sub-state]
  pending: ['bg-warn', 'checking', '…'],
  up: ['bg-ok', 'active', 'running'],
  down: ['bg-[#f87171]', 'failed', 'unreachable'],
  undeployed: ['bg-off', 'inactive', 'not deployed yet'],
}

export function StatusPanel() {
  const [states, setStates] = useState<Record<string, State>>(() =>
    Object.fromEntries(demoProjects.map((p) => [p.slug, p.demo ? { kind: 'pending' } : { kind: 'undeployed' }])),
  )

  useEffect(() => {
    let live = true
    demoProjects.forEach(async (p) => {
      if (!p.demo) return
      const s = await probe(p.demo)
      if (live) setStates((prev) => ({ ...prev, [p.slug]: s }))
    })
    return () => {
      live = false
    }
  }, [])

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface p-4 text-[13px] sm:p-5">
      <p className="text-muted">
        <span className="text-faint">$ </span>systemctl status demos
      </p>
      <ul className="mt-3 space-y-2.5">
        {demoProjects.map((p) => {
          const s = states[p.slug]
          const [dot, state, sub] = LABEL[s.kind]
          return (
            <li key={p.slug} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <span aria-hidden className={`relative top-[1px] inline-block h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
              <Link href={`/projects/${p.slug}`} className="min-w-[11rem] font-bold text-text hover:text-accent">
                {p.slug}-demo.service
              </Link>
              <span className="text-muted">
                <span className={s.kind === 'up' ? 'text-ok' : s.kind === 'down' ? 'text-[#f87171]' : 'text-faint'}>
                  {state}
                </span>{' '}
                ({sub})
                {s.kind === 'up' && <span className="text-faint"> · {s.ms} ms</span>}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-xs text-faint">Checked live from your browser. Demos run in Docker on Oracle Cloud.</p>
    </div>
  )
}
