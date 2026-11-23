import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes } from 'react'

// A tiny History API router: "/" and "/projects/:slug" are all this site needs.
// GitHub Pages serves 404.html (a copy of index.html) for deep links.

const listeners = new Set<() => void>()
const subscribe = (fn: () => void) => {
  listeners.add(fn)
  window.addEventListener('popstate', fn)
  return () => {
    listeners.delete(fn)
    window.removeEventListener('popstate', fn)
  }
}

export function navigate(to: string) {
  const url = new URL(to, window.location.href)
  if (url.pathname === window.location.pathname && url.hash) {
    // Same page: just scroll to the section.
    history.pushState(null, '', url.hash)
    document.getElementById(url.hash.slice(1))?.scrollIntoView()
    return
  }
  history.pushState(null, '', url.pathname + url.hash)
  listeners.forEach((fn) => fn())
}

export function usePath() {
  return useSyncExternalStore(subscribe, () => window.location.pathname)
}

/** After a route change, scroll to the #hash if there is one, otherwise to the top. */
export function useScrollOnRoute(path: string) {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    const el = id && document.getElementById(id)
    if (el) el.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [path])
}

/** <a> that routes internally for same-site links and behaves normally otherwise. */
export function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        if (!href.startsWith('/')) return
        e.preventDefault()
        navigate(href)
      }}
      {...rest}
    />
  )
}
