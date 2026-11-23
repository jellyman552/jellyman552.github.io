import { useEffect, useRef, useState } from 'react'
import type { Replay as ReplayData } from '../data/projects'

const STEP_MS = 6500
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Step-through of a conversation with Claude next to what it changed:
 * chat on one side, the real screenshot or terminal output on the other.
 * Autoplays while on screen until the visitor takes the controls. */
export function Replay({ data }: { data: ReplayData }) {
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(() => !reduceMotion())
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLElement>(null)
  const chat = useRef<HTMLOListElement>(null)
  const n = data.steps.length
  const step = data.steps[i]

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

  // Keep the newest message in view inside the chat pane (not the page).
  useEffect(() => {
    const el = chat.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion() ? 'auto' : 'smooth' })
  }, [i])

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
        <div className="flex items-center gap-1.5 text-xs">
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous step" className="rounded border border-line px-2 py-1 text-muted hover:border-accent hover:text-accent">
            ◀
          </button>
          <span aria-live="polite" className="w-12 text-center text-muted">
            {i + 1} / {n}
          </span>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next step" className="rounded border border-line px-2 py-1 text-muted hover:border-accent hover:text-accent">
            ▶
          </button>
          <button
            type="button"
            onClick={() => setAuto((a) => !a)}
            aria-label={auto ? 'Pause slideshow' : 'Play slideshow'}
            className="ml-1 rounded border border-line px-2 py-1 text-muted hover:border-accent hover:text-accent"
          >
            {auto ? '❚❚' : '▷ play'}
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]">
        {/* chat */}
        <ol ref={chat} aria-label="Conversation" className="h-72 space-y-4 overflow-y-auto border-b border-line p-4 text-[13px] leading-relaxed md:h-[26rem] md:border-r md:border-b-0">
          {data.steps.slice(0, i + 1).map((s, k) => (
            <li key={k} className={k === i ? '' : 'opacity-55'}>
              <p>
                <span className="font-bold text-accent-strong">you › </span>
                <span className="text-text">{s.you}</span>
              </p>
              {s.tools.map((t) => (
                <p key={t} className="ascii mt-1.5 truncate text-[11px] text-faint" title={t}>
                  ⚙ {t}
                </p>
              ))}
              <p className="mt-1.5">
                <span className="font-bold text-accent">claude › </span>
                <span className="text-text">{s.claude}</span>
              </p>
            </li>
          ))}
        </ol>

        {/* result */}
        <figure className="min-w-0">
          <div
            className={
              'relative bg-bg md:aspect-auto md:h-[23.5rem] ' +
              (data.steps.some((s) => s.shot) ? 'aspect-[1280/820]' : 'h-72')
            }
          >
            {data.steps.map((s, k) =>
              s.shot ? (
                <img
                  key={k}
                  src={s.shot}
                  alt={k === i ? s.caption : ''}
                  loading={k === 0 ? 'eager' : 'lazy'}
                  className={'absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ' + (k === i ? 'opacity-100' : 'opacity-0')}
                />
              ) : (
                <pre
                  key={k}
                  aria-hidden={k !== i}
                  className={'ascii absolute inset-0 overflow-auto p-4 text-[11px] leading-[1.45] text-text transition-opacity duration-500 ' + (k === i ? 'opacity-100' : 'pointer-events-none opacity-0')}
                >
                  {s.term}
                </pre>
              ),
            )}
          </div>
          <figcaption className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-xs text-muted">
            <span>{step.caption}</span>
            <span aria-hidden className="flex shrink-0 gap-1">
              {data.steps.map((_, k) => (
                <button
                  key={k}
                  type="button"
                  tabIndex={-1}
                  onClick={() => go(k)}
                  className={'h-1.5 w-4 rounded-full ' + (k === i ? 'bg-accent' : 'bg-line hover:bg-faint')}
                />
              ))}
            </span>
          </figcaption>
        </figure>
      </div>

      <p className="border-t border-line px-4 py-2 text-[11px] leading-relaxed text-faint">{data.note}</p>
    </section>
  )
}
