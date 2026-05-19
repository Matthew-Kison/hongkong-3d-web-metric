import type { SessionEntry } from '../types'

interface Env {
  url: string
  key: string
  table: string
}

function readEnv(): Env {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  const table = import.meta.env.VITE_SUPABASE_TABLE ?? 'sessions'
  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
    )
  }
  return { url, key, table }
}

export async function fetchSessions(): Promise<SessionEntry[]> {
  const { url, key, table } = readEnv()
  const endpoint = `${url}/rest/v1/${table}?select=*&order=created_at.desc`
  const res = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Supabase fetch ${res.status}: ${text || res.statusText}`)
  }
  const data: unknown = await res.json()
  if (!Array.isArray(data)) {
    throw new Error('Supabase response is not an array')
  }
  return data as SessionEntry[]
}
