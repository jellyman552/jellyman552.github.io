import type { ReactNode } from 'react'
import { Link } from '../router'

/** A shell prompt line: `jagger@portfolio:~$ <cmd>` */
export function Prompt({ cmd, path = '~' }: { cmd: string; path?: string }) {
  return (
    <p className="text-sm text-muted">
      <span className="text-accent">jagger@portfolio</span>
      <span className="text-faint">:</span>
      <span className="text-accent-strong">{path}</span>
      <span className="text-faint">$ </span>
      <span className="text-text">{cmd}</span>
    </p>
  )
}

export function Section({ id, cmd, title, children }: { id: string; cmd: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="py-14 sm:py-20">
      <Prompt cmd={cmd} />
      <h2 id={`${id}-h`} className="mt-2 mb-8 text-2xl font-bold tracking-tight text-text sm:text-3xl">
        <span className="text-faint"># </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="rounded border border-line bg-raised px-2 py-0.5 text-xs text-accent-strong">{children}</li>
  )
}

export function LinkButton({
  href,
  children,
  primary = false,
  download = false,
}: {
  href: string
  children: ReactNode
  primary?: boolean
  download?: boolean
}) {
  const external = href.startsWith('http')
  const A = href.startsWith('/') && !download ? Link : 'a'
  return (
    <A
      href={href}
      download={download || undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={
        'inline-flex items-center gap-2 rounded border px-3 py-1.5 text-sm transition-colors ' +
        (primary
          ? 'border-accent bg-accent text-bg hover:bg-accent-strong'
          : 'border-line text-text hover:border-accent hover:text-accent')
      }
    >
      {children}
    </A>
  )
}
