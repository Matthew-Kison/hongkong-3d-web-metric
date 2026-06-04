import type { SessionEntry, SortDir, SortKey } from '../types'
import { formatAbsoluteTime, formatDuration, formatRelativeTime } from '../utils/format'
import { VersionBadge } from './VersionBadge'

interface Props {
  sessions: SessionEntry[]
  sortKey: SortKey
  sortDir: SortDir
  onSortChange: (key: SortKey) => void
}

interface Column {
  key: SortKey
  label: string
  align: 'left' | 'right'
  render: (s: SessionEntry) => React.ReactNode
}

function formatItems(items: SessionEntry['ordered_items']): string {
  if (!items || items.length === 0) return '—'
  return items
    .map((it) => (it.quantity > 1 ? `${it.name} ×${it.quantity}` : it.name))
    .join(', ')
}

function formatSignature(items: SessionEntry['signature_items_ordered']): React.ReactNode {
  if (!items || items.length === 0) {
    return (
      <span className="rounded-md bg-(--color-bg) px-2 py-0.5 text-xs text-(--color-text-dim) ring-1 ring-(--color-border)">
        No
      </span>
    )
  }
  return (
    <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300 ring-1 ring-amber-500/30">
      Yes · {items.map((s) => s.name).join(', ')}
    </span>
  )
}

const COLUMNS: Column[] = [
  {
    key: 'order_id',
    label: 'Order ID',
    align: 'left',
    render: (s) => (
      <span className="font-mono font-semibold text-(--color-accent)">
        {s.order_id ?? '—'}
      </span>
    ),
  },
  {
    key: 'created_at',
    label: 'Time',
    align: 'left',
    render: (s) => (
      <span title={formatAbsoluteTime(s.created_at)}>{formatRelativeTime(s.created_at)}</span>
    ),
  },
  {
    key: 'participant_id',
    label: 'Participant',
    align: 'left',
    render: (s) => (
      <span className="font-mono text-xs" title={s.participant_id}>
        {s.participant_id.slice(0, 8)}
      </span>
    ),
  },
  {
    key: 'presented_version',
    label: 'Version',
    align: 'left',
    render: (s) => <VersionBadge version={s.presented_version} />,
  },
  {
    key: 'duration_sec',
    label: 'Duration',
    align: 'right',
    render: (s) => formatDuration(s.duration_sec),
  },
  {
    key: 'total_amount',
    label: 'Total',
    align: 'right',
    render: (s) => `$${Number(s.total_amount).toFixed(2)}`,
  },
]

export function SessionTable({ sessions, sortKey, sortDir, onSortChange }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-lg bg-(--color-panel) p-12 text-center text-(--color-text-dim) ring-1 ring-(--color-border)">
        No sessions match the current filters
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-(--color-panel) ring-1 ring-(--color-border)">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--color-border) text-xs uppercase tracking-wider text-(--color-text-dim)">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => onSortChange(col.key)}
                className={`cursor-pointer px-4 py-3 select-none hover:text-(--color-accent) ${
                  col.align === 'left' ? 'text-left' : 'text-right'
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key && (
                    <span className="text-(--color-accent)">
                      {sortDir === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </span>
              </th>
            ))}
            <th className="px-4 py-3 text-left">Signature ordered</th>
            <th className="px-4 py-3 text-left">Items</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr
              key={s.pk}
              className="border-b border-(--color-border) align-top last:border-b-0 hover:bg-(--color-panel-hover)"
            >
              {COLUMNS.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 tabular-nums ${
                    col.align === 'left' ? 'text-left' : 'text-right'
                  }`}
                >
                  {col.render(s)}
                </td>
              ))}
              <td className="px-4 py-3">{formatSignature(s.signature_items_ordered)}</td>
              <td className="px-4 py-3 text-xs text-(--color-text-dim)">
                {formatItems(s.ordered_items)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
