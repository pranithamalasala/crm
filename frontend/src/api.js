export const API = 'https://crm-5xc4.onrender.com'

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}
