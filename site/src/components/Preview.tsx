import { useEffect, useState } from 'react'
import type { Project } from '../data/projects'

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Card preview: screenshots (the replay's, else the gallery's) that cross-fade
 * while hovered/focused, else the replay's terminal output, else the diagram. */
export function Preview({ p, active }: { p: Project; active: boolean }) {
  const [i, setI] = useState(0)
  const replayShots = (p.replay?.steps ?? []).flatMap((s) => (s.shot ? [{ src: s.shot, alt: s.caption }] : []))
  const phoneShots = (p.walkthrough?.steps ?? []).map((s) => ({ src: s.shot, alt: s.title }))
  const phone = phoneShots.length > 0
  const shots = phone ? [...new Map(phoneShots.map((s) => [s.src, s])).values()] : replayShots.length ? replayShots : p.shots
  const n = shots.length

  useEffect(() => {
    if (!active || n < 2 || reduceMotion()) return
    const id = setInterval(() => setI((x) => (x + 1) % n), 1400)
    return () => clearInterval(id)
  }, [active, n])

  const frame = 'relative h-44 overflow-hidden rounded-md border border-line bg-bg sm:h-52'

  if (n) {
    return (
      <div className={frame}>
        {shots.map((s, k) => (
          <img
            key={s.src}
            src={s.src}
            alt={k === 0 ? s.alt : ''}
            loading="lazy"
            className={
              (phone ? 'absolute inset-y-3 left-1/2 h-[calc(100%-1.5rem)] w-auto -translate-x-1/2 rounded-xl border border-line object-contain transition-opacity duration-700 ' : 'absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ') +
              ((active ? i : 0) === k ? 'opacity-100' : 'opacity-0')
            }
          />
        ))}
        {n > 1 && (
          <div aria-hidden className="absolute right-2 bottom-2 flex gap-1">
            {shots.map((s, k) => (
              <span
                key={s.src}
                className={'h-1.5 w-1.5 rounded-full ' + ((active ? i : 0) === k ? 'bg-accent' : 'bg-text/40')}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const term = p.replay?.steps.find((s) => s.term)?.term
  const text = term ?? p.diagram
  if (!text) return null
  return (
    <div className={frame} aria-hidden>
      <pre
        className={
          'ascii p-3 text-[10px] leading-[1.35] text-muted transition-transform duration-[2500ms] ease-in-out ' +
          (active && term && !reduceMotion() ? '-translate-y-1/3' : '')
        }
      >
        {text}
      </pre>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg to-transparent" />
    </div>
  )
}
