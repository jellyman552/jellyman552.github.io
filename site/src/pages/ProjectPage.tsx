import { useEffect } from 'react'
import { Replay } from '../components/Replay'
import { LinkButton, Prompt, Tag } from '../components/ui'
import { profile } from '../data/profile'
import { projects, type Project } from '../data/projects'
import { Link } from '../router'

function H2({ children }: { children: string }) {
  return (
    <h2 className="mt-14 mb-4 text-xl font-bold text-text sm:text-2xl">
      <span className="text-faint">## </span>
      {children}
    </h2>
  )
}

export function ProjectPage({ p }: { p: Project }) {
  useEffect(() => {
    document.title = `${p.title} · ${profile.name}`
    return () => {
      document.title = `${profile.name} · ${profile.role}`
    }
  }, [p])

  const i = projects.indexOf(p)
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const next = projects[(i + 1) % projects.length]

  return (
    <article className="pt-10 pb-16 sm:pt-16" aria-labelledby="case-h">
      <Link href="/#projects" className="text-sm text-muted hover:text-accent">
        ← cd ../projects
      </Link>

      <div className="mt-6">
        <Prompt cmd={`cat README.md`} path={`~/projects/${p.slug}`} />
        <h1 id="case-h" className="mt-3 text-3xl font-extrabold tracking-tight text-accent glow sm:text-5xl">
          {p.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-text">{p.tagline}</p>

        <dl className="mt-6 grid max-w-3xl grid-cols-[6rem_1fr] gap-y-1.5 text-sm">
          <dt className="text-faint">role</dt>
          <dd className="text-text">{p.role}</dd>
          <dt className="text-faint">year</dt>
          <dd className="text-text">{p.year}</dd>
          {p.tests != null && (
            <>
              <dt className="text-faint">tests</dt>
              <dd className="text-text">{p.tests} passing</dd>
            </>
          )}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {p.demo && (
            <LinkButton href={p.demo} primary>
              ▶ live demo
            </LinkButton>
          )}
          {p.source && <LinkButton href={p.source}>source ↗</LinkButton>}
          {!p.demo && (p.demoNote || p.demoPlanned) && (
            <span className="rounded border border-dashed border-line px-3 py-1.5 text-sm text-faint">
              {p.demoNote ?? 'live demo coming soon'}
            </span>
          )}
          {!p.source && <span className="px-1 text-sm text-faint">source coming soon</span>}
        </div>
      </div>

      {p.replay && (
        <div className="mt-10">
          <Replay data={p.replay} />
        </div>
      )}

      {p.shots.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {p.shots.map((s, k) => (
            <figure key={s.src} className={k === 0 ? 'sm:col-span-2' : ''}>
              <a href={s.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg border border-line hover:border-accent/60">
                <img src={s.src} alt={s.alt} loading={k === 0 ? 'eager' : 'lazy'} className="w-full" />
              </a>
              <figcaption className="mt-2 text-xs text-faint">{s.alt}</figcaption>
            </figure>
          ))}
        </div>
      )}

      <H2>The problem</H2>
      <p className="max-w-3xl leading-relaxed text-text">{p.problem}</p>

      <H2>What I built</H2>
      <ul className="max-w-3xl space-y-2 leading-relaxed text-text">
        {p.highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <span aria-hidden className="text-accent">›</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      {p.diagram && (
        <>
          <H2>Architecture</H2>
          <figure className="overflow-x-auto rounded-lg border border-line bg-surface p-4 sm:p-6">
            <pre role="img" aria-label={`Architecture diagram for ${p.title}`} className="ascii text-[12px] leading-[1.35] text-accent-strong sm:text-[13px]">
              {p.diagram}
            </pre>
          </figure>
        </>
      )}

      <H2>Hard parts</H2>
      <div className="grid gap-4 md:grid-cols-2">
        {p.challenges.map((c) => (
          <section key={c.title} className="rounded-lg border border-line bg-surface p-5">
            <h3 className="font-bold text-accent">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
          </section>
        ))}
      </div>

      {p.next && p.next.length > 0 && (
        <>
          <H2>What's next</H2>
          <ul className="space-y-1.5 text-text">
            {p.next.map((n) => (
              <li key={n}>
                <span className="text-faint">[ ] </span>
                {n}
              </li>
            ))}
          </ul>
        </>
      )}

      <H2>Stack</H2>
      <ul aria-label="Tech stack" className="flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </ul>

      <nav aria-label="More projects" className="mt-16 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-sm">
        <Link href={`/projects/${prev.slug}`} className="text-muted hover:text-accent">
          ← {prev.title}
        </Link>
        <Link href={`/projects/${next.slug}`} className="text-muted hover:text-accent">
          {next.title} →
        </Link>
      </nav>
    </article>
  )
}
