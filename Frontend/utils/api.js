const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const logMood = (data) =>
  request('/api/log', { method: 'POST', body: JSON.stringify(data) })

export const getLogs = () => request('/api/logs')

export const getStats = () => request('/api/stats')

export const getInsights = () => request('/api/insights')

export const chat = (message) =>
  request('/api/chat', { method: 'POST', body: JSON.stringify({ message }) })