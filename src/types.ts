export type MenuVersion = 1 | 2 | 3 | 4

export const VERSION_LABELS: Record<MenuVersion, string> = {
  1: 'Text',
  2: 'Image',
  3: 'Motion',
  4: '3D',
}

export interface OrderedItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface SignatureItemRef {
  id: string
  name: string
}

export interface SessionEntry {
  pk: number
  participant_id: string
  presented_version: MenuVersion
  duration_sec: number
  ordered_items: OrderedItem[]
  signature_items_ordered: SignatureItemRef[]
  total_amount: number
  created_at: string
}

export type SortKey =
  | 'pk'
  | 'participant_id'
  | 'presented_version'
  | 'duration_sec'
  | 'total_amount'
  | 'created_at'

export type SortDir = 'asc' | 'desc'

export interface NumericRange {
  min: number | null
  max: number | null
}

export type VersionFilter = 'all' | MenuVersion
export type SignatureFilter = 'all' | 'ordered' | 'not_ordered'

export interface Filters {
  version: VersionFilter
  signature: SignatureFilter
  duration: NumericRange
  total: NumericRange
}

export const EMPTY_FILTERS: Filters = {
  version: 'all',
  signature: 'all',
  duration: { min: null, max: null },
  total: { min: null, max: null },
}
