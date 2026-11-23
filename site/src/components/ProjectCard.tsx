import { useState } from 'react'
import type { Project } from '../data/projects'
import { Link } from '../router'
import { Preview } from './Preview'
import { LinkButton, Tag } from './ui'

export function ProjectCard({ p, index }: { p: Project; index: number }) {
  const [active, setActive] = useState(false)
  const href = `/projects/${p.slug}`

  return (
    <article
      aria-labelledby={`p-${p.slug}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="group flex min-w-0 flex-col rounded-lg border border-line bg-surface p-4 transition-colors hover:border-accent/60 sm:p-5"
    >
      <Link href={href} tabIndex={-1} aria-hidden className="block">
        <Preview p={p} active={active} />
      </Link>

      <header className="mt-4 flex items-baseline justify-between gap-4">
        <h3 id={`p-${p.slug}`} className="text-lg font-bold">
          <Link href={href} className="text-accent glow hover:underline">
            <span className="font-normal text-faint">{String(index + 1).padStart(2, '0')} </span>
            {p.title}
          </Link>
        </h3>
        <span className="text-xs text-faint">{p.year}</span>
      </header>

      <p className="mt-2 text-sm leading-relaxed text-text">{p.tagline}</p>

      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
        {p.highlights.slice(0, 3).map((h) => (
          <li key={h} className="flex gap-2">
            <span aria-hidden className="text-accent">›</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <ul aria-label="Tech stack" className="mt-4 flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <LinkButton href={href} primary>
          read case study →
        </LinkButton>
        {p.demo && <LinkButton href={p.demo}>▶ live demo</LinkButton>}
        {p.source && <LinkButton href={p.source}>source ↗</LinkButton>}
        {!p.demo && !p.demoNote && <span className="px-1 text-xs text-faint">demo coming soon</span>}
      </div>
    </article>
  )
}

