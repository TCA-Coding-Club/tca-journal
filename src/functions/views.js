// Lightweight per-browser view tracking.
// NOTE: This is a static site with no backend, so view counts are stored
// locally in the visitor's browser (localStorage). They are not shared
// across visitors. Swapping this module for a real API/analytics call is
// all that would be needed to make the leaderboard global.

const KEY = "tca_article_views"

function readAll() {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || {}
  } catch (e) {
    return {}
  }
}

export function getAllViews() {
  return readAll()
}

export function getViews(slug) {
  return readAll()[slug] || 0
}

export function incrementView(slug) {
  if (typeof window === "undefined" || !slug) return
  try {
    const all = readAll()
    all[slug] = (all[slug] || 0) + 1
    window.localStorage.setItem(KEY, JSON.stringify(all))
  } catch (e) {
    /* ignore quota / privacy-mode errors */
  }
}
