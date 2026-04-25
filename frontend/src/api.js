export const API = 'http://localhost:5000'

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}
