/** Client-only: scroll-linked timeline fill + active experience card. */
export function mountExperienceTimeline(): (() => void) | undefined {
  const trackEl = document.querySelector('[data-experience-track]')
  const fillEl = document.querySelector('[data-experience-line-fill]')
  const items = document.querySelectorAll('[data-experience-item]')
  if (!trackEl || !fillEl || !items.length) return

  const track = trackEl
  const fill = fillEl

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion) {
    fill.setAttribute('style', 'height: 0%;')
    items.forEach((el) => el.classList.remove('is-active'))
    return
  }

  function update() {
    const rect = track.getBoundingClientRect()
    const centerY = window.innerHeight * 0.42
    const progress = Math.min(1, Math.max(0, (centerY - rect.top) / rect.height))
    fill.setAttribute('style', `height: ${progress * 100}%;`)

    let best = -1
    let bestDist = Infinity
    items.forEach((item, i) => {
      const r = item.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const mid = r.top + r.height / 2
      const dist = Math.abs(mid - centerY)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    items.forEach((item, i) => {
      item.classList.toggle('is-active', i === best && best >= 0)
    })
  }

  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })

  return () => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  }
}
