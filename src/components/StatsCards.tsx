import type { SessionEntry } from '../types'
import { formatDuration } from '../utils/format'

interface Props {
  sessions: SessionEntry[]
  total: number
}

export function StatsCards({ sessions, total }: Props) {
  const stats = computeStats(sessions)

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card label="Filtered / Total" value={`${sessions.length} / ${total}`} />
      <Card label="Avg duration" value={stats ? formatDuration(stats.avgDuration) : '—'} />
      <Card label="Avg order total" value={stats ? `$${stats.avgTotal.toFixed(2)}` : '—'} />
      <Card
        label="Signature order rate"
        value={
          stats
            ? `${(stats.signatureRate * 100).toFixed(0)}% (${stats.signatureCount}/${sessions.length})`
            : '—'
        }
      />
    </div>
  )
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-(--color-panel) p-4 ring-1 ring-(--color-border)">
      <div className="text-xs uppercase tracking-wider text-(--color-text-dim)">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}

function computeStats(sessions: SessionEntry[]) {
  if (sessions.length === 0) return null
  let durationSum = 0
  let totalSum = 0
  let signatureCount = 0
  for (const s of sessions) {
    durationSum += s.duration_sec
    totalSum += Number(s.total_amount)
    if (s.signature_items_ordered && s.signature_items_ordered.length > 0) signatureCount++
  }
  const n = sessions.length
  return {
    avgDuration: durationSum / n,
    avgTotal: totalSum / n,
    signatureCount,
    signatureRate: signatureCount / n,
  }
}
