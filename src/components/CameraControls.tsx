import type { ReactNode } from 'react'

type CameraControlsProps = {
  selectedTool: 'camera' | 'filter' | 'frame'
  onSelectTool: (tool: 'camera' | 'filter' | 'frame') => void
}

type ToolItem = {
  key: 'camera' | 'filter' | 'frame'
  icon: ReactNode
}

const TOOL_ITEMS: ToolItem[] = [
  {
    key: 'camera',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path
          d="M8 7.5 9.2 6h5.6L16 7.5H18A2.5 2.5 0 0 1 20.5 10v6A2.5 2.5 0 0 1 18 18.5H6A2.5 2.5 0 0 1 3.5 16v-6A2.5 2.5 0 0 1 6 7.5h2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    key: 'filter',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path
          d="M4.5 7.5c0-1.657 3.358-3 7.5-3s7.5 1.343 7.5 3-3.358 3-7.5 3-7.5-1.343-7.5-3Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M4.5 12c0-1.657 3.358-3 7.5-3s7.5 1.343 7.5 3-3.358 3-7.5 3-7.5-1.343-7.5-3Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M4.5 16.5c0-1.657 3.358-3 7.5-3s7.5 1.343 7.5 3-3.358 3-7.5 3-7.5-1.343-7.5-3Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    key: 'frame',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <rect
          x="5"
          y="5"
          width="14"
          height="14"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M9 5.8v12.4M15 5.8v12.4M5.8 9h12.4M5.8 15h12.4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

const SWATCHES = [
  'bg-[linear-gradient(135deg,#e8edf7_0%,#bfcbe2_100%)]',
  'bg-[linear-gradient(135deg,#f5d0e6_0%,#d9cff8_100%)]',
  'bg-[linear-gradient(135deg,#c7e7ef_0%,#dce8ff_100%)]',
  'bg-[linear-gradient(135deg,#f5dccd_0%,#f4e7ea_100%)]',
]

export function CameraControls({
  selectedTool,
  onSelectTool,
}: CameraControlsProps) {
  return (
    <section className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 rounded-[24px] border border-[#e8e8ee] bg-white px-3 py-3 shadow-[0_12px_40px_rgba(24,39,75,0.08)]">
      <div className="flex items-center gap-2">
        {TOOL_ITEMS.map((item) => {
          const isActive = item.key === selectedTool

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectTool(item.key)}
              className={`grid size-11 place-items-center rounded-2xl border transition ${
                isActive
                  ? 'border-[#d9dcea] bg-[#f4f6fb] text-[#49516a]'
                  : 'border-[#edf0f6] bg-white text-[#8d94a8] hover:border-[#dfe4f0] hover:text-[#687089]'
              }`}
              aria-pressed={isActive}
            >
              {item.icon}
            </button>
          )
        })}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 overflow-hidden">
        {SWATCHES.map((swatchClassName, index) => (
          <button
            key={index}
            type="button"
            className={`h-11 w-14 shrink-0 rounded-xl border border-[#eef1f5] ${swatchClassName}`}
            aria-label={`Preset ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
