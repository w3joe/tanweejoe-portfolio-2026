import { SOCIAL_LINKS } from '@/consts'

/** Stable canonical URL for the current path (no query/hash). */
export function canonicalHref(site: URL | undefined, pathname: string): string {
  if (site) {
    const path =
      pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
    return new URL(path || '/', site).href
  }
  return pathname || '/'
}

/** Build absolute URL for a site-relative path (e.g. `/static/og.png`). */
export function absoluteUrl(site: URL | undefined, path: string): string {
  const base = site ?? new URL('https://tanweejoe.com')
  const clean = path.startsWith('/') ? path : `/${path}`
  return new URL(clean, base).href
}

/** SameAs URLs for JSON-LD (public profiles only). */
export function profileSameAs(): string[] {
  return SOCIAL_LINKS.map((l) => l.href).filter(
    (h) => h.startsWith('http') && !h.endsWith('/rss.xml'),
  )
}
