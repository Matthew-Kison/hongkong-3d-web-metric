import type {
  AidsCount,
  AidsFilter,
  Filters,
  MenuVersion,
  NumericRange,
  SignatureFilter,
  VersionFilter,
} from '../types'
import { EMPTY_FILTERS, VERSION_LABELS } from '../types'

interface Props {
  filters: Filters
  onChange: (next: Filters) => void
}

const VERSION_OPTIONS: { value: VersionFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...([1, 2, 3, 4] as MenuVersion[]).map((v) => ({
    value: v,
    label: `V${v} ${VERSION_LABELS[v]}`,
  })),
]

const AIDS_OPTIONS: { value: AidsFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...([1, 2] as AidsCount[]).map((v) => ({ value: v, label: String(v) })),
]

const SIGNATURE_OPTIONS: { value: SignatureFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ordered', label: 'Signature ordered' },
  { value: 'not_ordered', label: 'No signature' },
]

export function FilterPanel({ filters, onChange }: Props) {
  const updateRange = (key: 'duration' | 'total', range: NumericRange) => {
    onChange({ ...filters, [key]: range })
  }

  const isDirty = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS)

  return (
    <div className="rounded-lg bg-(--color-panel) p-4 ring-1 ring-(--color-border)">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-(--color-text-dim)">
          Filters
        </h2>
        {isDirty && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="text-xs text-(--color-accent) hover:text-(--color-accent-hover)"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-xs text-(--color-text-dim)">Version</label>
        <div className="flex flex-wrap gap-2">
          {VERSION_OPTIONS.map((opt) => {
            const active = filters.version === opt.value
            return (
              <button
                key={String(opt.value)}
                onClick={() => onChange({ ...filters, version: opt.value })}
                className={`rounded-md px-3 py-1 text-sm ring-1 transition-colors ${
                  active
                    ? 'bg-(--color-accent)/15 text-(--color-accent) ring-(--color-accent)/40'
                    : 'bg-(--color-bg) text-(--color-text-dim) ring-(--color-border) hover:text-(--color-text)'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-xs text-(--color-text-dim)">Aids per category</label>
        <div className="flex flex-wrap gap-2">
          {AIDS_OPTIONS.map((opt) => {
            const active = filters.aids === opt.value
            return (
              <button
                key={String(opt.value)}
                onClick={() => onChange({ ...filters, aids: opt.value })}
                className={`rounded-md px-3 py-1 text-sm ring-1 transition-colors ${
                  active
                    ? 'bg-(--color-accent)/15 text-(--color-accent) ring-(--color-accent)/40'
                    : 'bg-(--color-bg) text-(--color-text-dim) ring-(--color-border) hover:text-(--color-text)'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-xs text-(--color-text-dim)">Signature</label>
        <div className="flex flex-wrap gap-2">
          {SIGNATURE_OPTIONS.map((opt) => {
            const active = filters.signature === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => onChange({ ...filters, signature: opt.value })}
                className={`rounded-md px-3 py-1 text-sm ring-1 transition-colors ${
                  active
                    ? 'bg-(--color-accent)/15 text-(--color-accent) ring-(--color-accent)/40'
                    : 'bg-(--color-bg) text-(--color-text-dim) ring-(--color-border) hover:text-(--color-text)'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <RangeInput
          label="Duration (s)"
          value={filters.duration}
          onChange={(r) => updateRange('duration', r)}
        />
        <RangeInput
          label="Total amount ($)"
          value={filters.total}
          onChange={(r) => updateRange('total', r)}
        />
      </div>
    </div>
  )
}

interface RangeProps {
  label: string
  value: NumericRange
  onChange: (range: NumericRange) => void
}

function RangeInput({ label, value, onChange }: RangeProps) {
  return (
    <div>
      <label className="mb-1 block text-xs text-(--color-text-dim)">{label}</label>
      <div className="flex items-center gap-2">
        <NumberField
          placeholder="min"
          value={value.min}
          onChange={(v) => onChange({ ...value, min: v })}
        />
        <span className="text-(--color-text-dim)">~</span>
        <NumberField
          placeholder="max"
          value={value.max}
          onChange={(v) => onChange({ ...value, max: v })}
        />
      </div>
    </div>
  )
}

function NumberField({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string
  value: number | null
  onChange: (v: number | null) => void
}) {
  return (
    <input
      type="number"
      step="any"
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) => {
        const raw = e.target.value
        if (raw === '') {
          onChange(null)
          return
        }
        const n = Number(raw)
        if (!Number.isNaN(n)) onChange(n)
      }}
      className="w-full rounded-md border border-(--color-border) bg-(--color-bg) px-2 py-1 text-sm tabular-nums outline-none focus:border-(--color-accent)"
    />
  )
}
