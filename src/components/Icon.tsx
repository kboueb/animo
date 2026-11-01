// Petites icônes en SVG inline (trait 2px, 24×24), pour ne dépendre d'aucune librairie.
const PATHS = {
  check: 'M5 12.5l4.5 4.5L19 7.5',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  bookmark: 'M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z',
  plus: 'M12 5v14M5 12h14',
  search: 'M20 20l-4.2-4.2M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12',
  download: 'M12 4v11m0 0l-4-4m4 4l4-4M5 19h14',
  upload: 'M12 16V5m0 0L8 9m4-4l4 4M5 19h14',
  refresh: 'M20 11a8 8 0 0 0-14.6-4.5L4 8m0-4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16m0 4v-4h-4',
  close: 'M6 6l12 12M18 6L6 18',
  cloud: 'M7 18.5h10.5a4 4 0 0 0 .6-7.96A6.5 6.5 0 0 0 5.6 9.7 4.4 4.4 0 0 0 7 18.5z',
  sparkle: 'M12 3c.6 4.6 1.9 6 6.5 6.5-4.6.6-5.9 1.9-6.5 6.5-.6-4.6-1.9-5.9-6.5-6.5C10.1 9 11.4 7.6 12 3z',
} as const

export type IconName = keyof typeof PATHS

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="icon"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
