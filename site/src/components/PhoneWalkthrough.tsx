import { useEffect, useRef, useState } from 'react'
import type { Walkthrough } from '../data/projects'

const STEP_MS = 5500
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** A phone-sized walkthrough: the screen on one side, the steps on the other.
 * Steps about notifications show the app's real push text in a card that
 * slides in over the screen. Autoplays while visible until the visitor clicks. */
export function PhoneWalkthrough({ data }: { data: Walkthrough }) {
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(() => !reduceMotion())
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLElement>(null)
  const n = data.steps.length

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!auto || !visible) return
    const id = setTimeout(() => setI((x) => (x + 1) % n), STEP_MS)
    return () => clearTimeout(id)
  }, [auto, visible, i, n])

  const go = (to: number) => {
    setAuto(false)
    setI((to + n) % n)
  }

  return (
    <section ref={root} aria-label={data.title} className="overflow-hidden rounded-lg border border-line bg-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="text-sm font-bold text-text">
          <span className="text-faint">▸ </span>
          {data.title}
        </h2>
        <button
          type="button"
          onClick={() => setAuto((a) => !a)}
          aria-label={auto ? 'Pause walkthrough' : 'Play walkthrough'}
          className="rounded border border-line px-2 py-1 text-xs text-muted hover:border-accent hover:text-accent"
        >
          {auto ? '❚❚' : '▷ play'}
        </button>
      </header>

      <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
        {/* phone */}
        <div className="mx-auto w-[240px] sm:w-[260px]">
          <div className="relative aspect-[390/844] overflow-hidden rounded-[2.2rem] border-[6px] border-raised bg-bg shadow-[0_0_40px_-12px_rgba(3,215,252,0.35)]">
            {data.steps.map((s, k) => (
              <img
                key={s.title}
                src={s.shot}
                alt={k === i ? s.title : ''}
                loading={k === 0 ? 'eager' : 'lazy'}
                className={'absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ' + (k === i ? 'opacity-100' : 'opacity-0')}
              />
            ))}
            {data.steps.map((s, k) =>
              s.notification ? (
                <div
                  key={`n-${k}`}
                  aria-hidden={k !== i}
                  className={
                    'absolute inset-x-2 top-2 rounded-xl border border-line bg-surface/95 p-2.5 text-[10.5px] leading-snug shadow-lg backdrop-blur transition-all duration-500 ' +
                    (k === i ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0')
                  }
                >
                  <div className="flex items-center justify-between text-[9.5px] text-faint">
                    <span>Daily Tasks</span>
                    <span>{s.notification.when}</span>
                  </div>
                  <p className="mt-0.5 font-bold text-text">{s.notification.title}</p>
                  <p className="text-muted">{s.notification.body}</p>
                </div>
              ) : null,
            )}
          </div>
        </div>

        {/* steps */}
        <ol className="space-y-1.5">
          {data.steps.map((s, k) => (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => go(k)}
                aria-current={k === i ? 'step' : undefined}
                className={
                  'w-full rounded-md border px-3.5 py-2.5 text-left transition-colors ' +
                  (k === i ? 'border-accent/60 bg-raised' : 'border-transparent hover:bg-raised/60')
                }
              >
                <span className={'block text-sm font-bold ' + (k === i ? 'text-accent' : 'text-text')}>
                  <span className="font-normal text-faint">{k + 1}. </span>
                  {s.title}
                </span>
                <span className={'mt-1 block text-[13px] leading-relaxed text-muted ' + (k === i ? '' : 'hidden md:block md:opacity-60')}>
                  {s.text}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <p className="border-t border-line px-4 py-2 text-[11px] leading-relaxed text-faint">{data.note}</p>
    </section>
  )
}
