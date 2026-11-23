import { useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { navigate } from '../router'

type Cmd = { id: string; label: string; hint: string; run: () => void }

const openTab = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')

function buildCommands(notify: (msg: string) => void): Cmd[] {
  const cmds: Cmd[] = [
    { id: 'home', label: 'cd ~', hint: 'home', run: () => navigate('/') },
    ...['projects', 'about', 'experience', 'contact'].map((s) => ({
      id: `go-${s}`,
      label: `cd ~/${s}`,
      hint: 'section',
      run: () => navigate(`/#${s}`),
    })),
    ...projects.map((p) => ({
      id: `open-${p.slug}`,
      label: `open ${p.slug}`,
      hint: 'case study',
      run: () => navigate(`/projects/${p.slug}`),
    })),
    ...projects.flatMap((p) =>
      p.demo ? [{ id: `demo-${p.slug}`, label: `demo ${p.slug}`, hint: 'live demo ↗', run: () => openTab(p.demo!) }] : [],
    ),
    ...projects.flatMap((p) =>
      p.source ? [{ id: `src-${p.slug}`, label: `git clone ${p.slug}`, hint: 'source ↗', run: () => openTab(p.source!) }] : [],
    ),
    {
      id: 'resume',
      label: 'wget resume.pdf',
      hint: 'download',
      run: () => {
        const a = document.createElement('a')
        a.href = profile.resume
        a.download = ''
        a.click()
      },
    },
    {
      id: 'email',
      label: 'copy email',
      hint: profile.email,
      run: () => {
        navigator.clipboard?.writeText(profile.email).then(
          () => notify('Email copied'),
          () => (window.location.href = `mailto:${profile.email}`),
        )
      },
    },
    { id: 'github', label: 'open github', hint: '↗', run: () => openTab(profile.github) },
    { id: 'linkedin', label: 'open linkedin', hint: '↗', run: () => openTab(profile.linkedin) },
  ]
  return cmds
}

export function CommandPalette({ open, onClose, notify }: { open: boolean; onClose: () => void; notify: (m: string) => void }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const restore = useRef<HTMLElement | null>(null)
  const commands = useMemo(() => buildCommands(notify), [notify])

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    return commands.filter((c) => terms.every((t) => `${c.label} ${c.hint}`.toLowerCase().includes(t)))
  }, [q, commands])

  useEffect(() => {
    if (open) {
      restore.current = document.activeElement as HTMLElement
      setQ('')
      setSel(0)
      input.current?.focus()
    } else {
      restore.current?.focus?.()
    }
  }, [open])

  useEffect(() => setSel(0), [q])

  if (!open) return null

  const run = (c: Cmd | undefined) => {
    if (!c) return
    onClose()
    c.run()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-bg/70 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-lg border border-line bg-surface shadow-2xl shadow-black/50"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
          else if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSel((s) => Math.min(s + 1, results.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSel((s) => Math.max(s - 1, 0))
          } else if (e.key === 'Enter') run(results[sel])
          else if (e.key === 'Tab') e.preventDefault() // keep focus in the input
        }}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="text-accent">❯</span>
          <input
            ref={input}
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="type a command… (try: open, demo, resume)"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[sel] ? `cmd-${results[sel].id}` : undefined}
            className="w-full bg-transparent text-sm text-text placeholder:text-faint focus:outline-none"
          />
          <kbd className="rounded border border-line px-1.5 text-[10px] text-faint">esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto py-1">
          {results.length === 0 && <li className="px-4 py-3 text-sm text-faint">command not found: {q}</li>}
          {results.map((c, i) => (
            <li
              key={c.id}
              id={`cmd-${c.id}`}
              role="option"
              aria-selected={i === sel}
              onMouseMove={() => setSel(i)}
              onClick={() => run(c)}
              className={
                'flex cursor-pointer items-center justify-between gap-4 px-4 py-2 text-sm ' +
                (i === sel ? 'bg-raised text-accent' : 'text-text')
              }
            >
              <span>{c.label}</span>
              <span className="truncate text-xs text-faint">{c.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
