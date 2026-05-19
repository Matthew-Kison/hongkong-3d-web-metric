import type { MenuVersion } from '../types'
import { VERSION_LABELS } from '../types'

interface Props {
  version: MenuVersion
}

const STYLES: Record<MenuVersion, string> = {
  1: 'bg-gray-500/15 text-gray-300 ring-gray-500/30',
  2: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  3: 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
  4: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
}

export function VersionBadge({ version }: Props) {
  return (
    <span className={`whitespace-nowrap rounded-md px-2 py-0.5 text-xs ring-1 ${STYLES[version]}`}>
      V{version} · {VERSION_LABELS[version]}
    </span>
  )
}
