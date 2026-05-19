import { useCallback, useEffect, useMemo, useState } from 'react'
import { FilterPanel } from './components/FilterPanel'
import { SessionTable } from './components/SessionTable'
import { StatsCards } from './components/StatsCards'
import type { Filters, NumericRange, SessionEntry, SortDir, SortKey } from './types'
import { EMPTY_FILTERS } from './types'
import { defaultCsvFilename, downloadCsv } from './utils/csv'
import { fetchSessions } from './utils/supabase'

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; sessions: SessionEntry[]; loadedAt: Date }
  | { status: 'error'; message: string }

export function App() {
  const [load, setLoad] = useState<LoadState>({ status: 'idle' })
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const refresh = useCallback(async () => {
    setLoad({ status: 'loading' })
    try {
      const sessions = await fetchSessions()
      setLoad({ status: 'success', sessions, loadedAt: new Date() })
    } catch (e) {
      setLoad({ status: 'error', message: (e as Error).message })
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const sessions = load.status === 'success' ? load.sessions : []

  const handleSortChange = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filteredSorted = useMemo(() => {
    const filtered = sessions.filter((s) => matchesFilters(s, filters))
    const sorted = [...filtered].sort((a, b) => compareBy(a, b, sortKey, sortDir))
    return sorted
  }, [sessions, filters, sortKey, sortDir])

  return (
    <div className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">HongKong 3D Web Metrics</h1>
            <p className="mt-1 text-sm text-(--color-text-dim)">
              Participant sessions loaded from Supabase
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {load.status === 'success' && (
              <span className="text-(--color-text-dim)">
                Updated {load.loadedAt.toLocaleTimeString('en-US')}
              </span>
            )}
            {load.status === 'success' && (
              <button
                onClick={() => downloadCsv(filteredSorted, defaultCsvFilename())}
                disabled={filteredSorted.length === 0}
                title={
                  filteredSorted.length === 0
                    ? 'No rows to export'
                    : `Download ${filteredSorted.length} row${filteredSorted.length === 1 ? '' : 's'} as CSV`
                }
                className="rounded-md border border-(--color-border) bg-(--color-panel) px-3 py-1.5 hover:bg-(--color-panel-hover) disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export CSV ({filteredSorted.length})
              </button>
            )}
            <button
              onClick={refresh}
              disabled={load.status === 'loading'}
              className="rounded-md border border-(--color-border) bg-(--color-panel) px-3 py-1.5 hover:bg-(--color-panel-hover) disabled:opacity-50"
            >
              {load.status === 'loading' ? 'Loading…' : 'Refresh'}
            </button>
          </div>
        </header>

        {load.status === 'loading' && (
          <div className="rounded-lg bg-(--color-panel) p-12 text-center text-(--color-text-dim) ring-1 ring-(--color-border)">
            Loading data…
          </div>
        )}

        {load.status === 'error' && (
          <div className="rounded-lg bg-(--color-panel) p-6 ring-1 ring-(--color-danger)/40">
            <h2 className="font-semibold text-(--color-danger)">Failed to load data</h2>
            <p className="mt-2 text-sm text-(--color-text-dim)">{load.message}</p>
            <button
              onClick={refresh}
              className="mt-3 rounded-md border border-(--color-border) px-3 py-1.5 text-sm hover:bg-(--color-panel-hover)"
            >
              Retry
            </button>
          </div>
        )}

        {load.status === 'success' && (
          <>
            <StatsCards sessions={filteredSorted} total={sessions.length} />
            <FilterPanel filters={filters} onChange={setFilters} />
            <SessionTable
              sessions={filteredSorted}
              sortKey={sortKey}
              sortDir={sortDir}
              onSortChange={handleSortChange}
            />
          </>
        )}
      </div>
    </div>
  )
}

function matchesFilters(s: SessionEntry, f: Filters): boolean {
  if (f.version !== 'all' && s.presented_version !== f.version) return false
  const sigCount = s.signature_items_ordered?.length ?? 0
  if (f.signature === 'ordered' && sigCount === 0) return false
  if (f.signature === 'not_ordered' && sigCount > 0) return false
  if (!inRange(s.duration_sec, f.duration)) return false
  if (!inRange(Number(s.total_amount), f.total)) return false
  return true
}

function inRange(value: number, range: NumericRange): boolean {
  if (range.min !== null && value < range.min) return false
  if (range.max !== null && value > range.max) return false
  return true
}

function compareBy(a: SessionEntry, b: SessionEntry, key: SortKey, dir: SortDir): number {
  const av = a[key]
  const bv = b[key]
  let cmp: number
  if (av === null && bv === null) cmp = 0
  else if (av === null) cmp = -1
  else if (bv === null) cmp = 1
  else if (typeof av === 'string' && typeof bv === 'string') cmp = av.localeCompare(bv)
  else cmp = (av as number) - (bv as number)
  return dir === 'asc' ? cmp : -cmp
}
