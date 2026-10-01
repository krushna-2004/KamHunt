export function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  const days = Math.floor(seconds / 86400)
  if (days < 30) return `${days}d ago`
  return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Only allow http(s) links so a bad value can never run script
export const isSafeUrl = (url) => /^https?:\/\//i.test(url || '')

export const lines = (text) =>
  (text || '').split('\n').map((l) => l.trim()).filter(Boolean)
