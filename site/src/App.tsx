import { useCallback, useEffect, useState } from 'react'
import { CommandPalette } from './components/CommandPalette'
import { profile } from './data/profile'
import { getProject } from './data/projects'
import { Home } from './pages/Home'
import { ProjectPage } from './pages/ProjectPage'
import { Link, usePath, useScrollOnRoute } from './router'

const nav = ['projects', 'about', 'experience', 'contact']

export default function App() {
  const path = usePath()
  useScrollOnRoute(path)
  const [palette, setPalette] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const notify = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }, [])

  const slug = path.match(/^\/projects\/([\w-]+)\/?$/)?.[1]
  const project = slug ? getProject(slug) : undefined
  const isHome = path === '/' || path === '/index.html'

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-bg">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="text-sm font-bold text-accent">
            ~/{profile.handle}
          </Link>
          <nav aria-label="Sections" className="flex items-center gap-3 text-sm sm:gap-5">
            {nav.map((n) => (
              <Link key={n} href={`/#${n}`} className="hidden text-muted hover:text-accent md:inline">
                ./{n}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setPalette(true)}
              aria-label="Open command palette"
              className="rounded border border-line px-2 py-1 text-xs text-muted hover:border-accent hover:text-accent"
            >
              ⌘K
            </button>
            <a
              href={profile.resume}
              download
              className="rounded border border-accent px-2.5 py-1 text-accent hover:bg-accent hover:text-bg"
            >
              résumé.pdf
            </a>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-5xl px-4 sm:px-6">
        {project ? (
          <ProjectPage key={project.slug} p={project} />
        ) : isHome ? (
          <Home onPalette={() => setPalette(true)} />
        ) : (
          <section className="py-24">
            <p className="text-muted">
              <span className="text-faint">$ </span>cd {path}
            </p>
            <h1 className="mt-3 text-2xl font-bold text-text">bash: cd: {path}: No such file or directory</h1>
            <Link href="/" className="mt-6 inline-block text-accent hover:underline">
              ← cd ~
            </Link>
          </section>
        )}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-faint sm:px-6">
          <span className="text-accent">$</span> exit · built with React, Vite and Tailwind · © {new Date().getFullYear()} {profile.name}
        </div>
      </footer>

      <CommandPalette open={palette} onClose={() => setPalette(false)} notify={notify} />
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center">
        {toast && <span className="rounded border border-accent bg-surface px-3 py-1.5 text-sm text-accent">{toast}</span>}
      </div>
    </>
  )
}
