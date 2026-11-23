import type { Project } from '../data/projects'
import { LinkButton, Tag } from './ui'

export function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <article
      aria-labelledby={`p-${p.slug}`}
      className="group flex flex-col rounded-lg border border-line bg-surface p-5 transition-colors hover:border-accent/60 sm:p-6"
    >
      <header className="flex items-baseline justify-between gap-4">
        <h3 id={`p-${p.slug}`} className="text-lg font-bold text-accent glow">
          <span className="text-faint font-normal">{String(index + 1).padStart(2, '0')} </span>
          {p.title}
        </h3>
        <span className="text-xs text-faint">{p.year}</span>
      </header>

      <p className="mt-2 text-sm leading-relaxed text-text">{p.tagline}</p>

      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
        {p.highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <span aria-hidden className="text-accent">›</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <ul aria-label="Tech stack" className="mt-5 flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        {p.demo ? (
          <LinkButton href={p.demo} primary>
            ▶ live demo
          </LinkButton>
        ) : (
          <span className="rounded border border-dashed border-line px-3 py-1.5 text-sm text-faint">
            {p.demoNote ?? 'demo · coming soon'}
          </span>
        )}
        {p.source ? (
          <LinkButton href={p.source}>source ↗</LinkButton>
        ) : (
          <span className="px-1 text-sm text-faint">source · coming soon</span>
        )}
      </div>
    </article>
  )
}
