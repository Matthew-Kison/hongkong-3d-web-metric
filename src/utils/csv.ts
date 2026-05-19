import type { SessionEntry } from '../types'

const HEADERS = [
  'pk',
  'created_at',
  'participant_id',
  'presented_version',
  'duration_sec',
  'total_amount',
  'signature_ordered',
  'signature_items',
  'ordered_items',
] as const

export function toCsv(sessions: SessionEntry[]): string {
  const lines = [HEADERS.join(',')]
  for (const s of sessions) {
    const row = [
      s.pk,
      s.created_at,
      s.participant_id,
      s.presented_version,
      s.duration_sec,
      s.total_amount,
      s.signature_items_ordered && s.signature_items_ordered.length > 0 ? 'yes' : 'no',
      (s.signature_items_ordered || []).map((it) => it.name).join(' | '),
      (s.ordered_items || [])
        .map((it) => (it.quantity > 1 ? `${it.name} x${it.quantity}` : it.name))
        .join(' | '),
    ]
    lines.push(row.map(escapeField).join(','))
  }
  return lines.join('\n')
}

function escapeField(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function downloadCsv(sessions: SessionEntry[], filename: string): void {
  // BOM prefix so Excel opens UTF-8 correctly
  const blob = new Blob(['﻿', toCsv(sessions)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function defaultCsvFilename(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  return `hongkong-3d-sessions-${stamp}.csv`
}
