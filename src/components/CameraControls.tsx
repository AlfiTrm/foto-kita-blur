import type { ReactNode } from 'react'
import type { CameraTool, FilterPresetId, FramePresetId } from '../types/visual'
import { FILTER_PRESETS, FRAME_PRESETS } from '../utils/visualOptions'

type CameraControlsProps = {
  captureDisabled: boolean
  hasPhoto: boolean
  onCapture: () => void
  onDownload: () => void
  selectedFilter: FilterPresetId
  selectedFrame: FramePresetId
  selectedTool: CameraTool
  onRetake: () => void
  onSelectFilter: (filterId: FilterPresetId) => void
  onSelectFrame: (frameId: FramePresetId) => void
  onSelectTool: (tool: CameraTool) => void
}

type ToolItem = {
  key: CameraTool
  icon: ReactNode
}

const TOOL_ITEMS: ToolItem[] = [
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

function RailActionButton({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      className={`grid h-12 w-full place-items-center rounded-2xl border border-white/75 bg-white/88 text-[#667089] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:border-[#dfe4f0] hover:text-[#49516a] disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function CameraControls({
  captureDisabled,
  hasPhoto,
  onCapture,
  onDownload,
  onRetake,
  selectedFilter,
  selectedFrame,
  selectedTool,
  onSelectFilter,
  onSelectFrame,
  onSelectTool,
}: CameraControlsProps) {
  const swatches =
    selectedTool === 'filter'
      ? FILTER_PRESETS.map((preset) => ({
          id: preset.id,
          isActive: preset.id === selectedFilter,
          previewClassName: preset.previewClassName,
          onClick: () => onSelectFilter(preset.id),
        }))
      : selectedTool === 'frame'
        ? FRAME_PRESETS.map((preset) => ({
            id: preset.id,
            isActive: preset.id === selectedFrame,
            previewClassName: preset.previewClassName,
            onClick: () => onSelectFrame(preset.id),
          }))
        : []

  return (
    <aside className="flex w-full flex-col gap-3 rounded-[28px] border border-white/70 bg-white/82 p-3 shadow-[0_20px_60px_rgba(24,39,75,0.08)] backdrop-blur-xl lg:h-[34rem] lg:min-h-[34rem]">
      <div className="grid gap-3">
        {hasPhoto ? (
          <>
            <RailActionButton onClick={onRetake} aria-label="Retake photo">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
                <path
                  d="M12 7.5a4.5 4.5 0 1 0 4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M16.5 7.5H12V3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </RailActionButton>
            <RailActionButton onClick={onDownload} aria-label="Download photo">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
                <path
                  d="M12 5v9m0 0 3.5-3.5M12 14l-3.5-3.5M6.5 18.5h11"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </RailActionButton>
          </>
        ) : (
          <button
            type="button"
            onClick={onCapture}
            disabled={captureDisabled}
            className="grid h-24 w-full place-items-center rounded-[24px] border border-[#d6deef] bg-[linear-gradient(180deg,#ffffff_0%,#eef3fb_100%)] shadow-[0_14px_34px_rgba(24,39,75,0.08)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Capture photo"
          >
            <span className="grid size-16 place-items-center rounded-full border border-[#cfd8eb] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]" />
          </button>
        )}
      </div>

      <div className="mt-1 flex flex-col gap-2 lg:mt-4">
        {TOOL_ITEMS.map((item) => {
          const isActive = item.key === selectedTool

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectTool(item.key)}
              className={`grid h-11 w-full place-items-center rounded-2xl border transition ${
                isActive
                  ? 'border-[#d9dcea] bg-[linear-gradient(180deg,#f7f9fd_0%,#edf2fa_100%)] text-[#49516a] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]'
                  : 'border-[#edf0f6] bg-white/88 text-[#8d94a8] hover:border-[#dfe4f0] hover:text-[#687089]'
              }`}
              aria-pressed={isActive}
            >
              {item.icon}
            </button>
          )
        })}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto pr-1">
        {swatches.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            onClick={swatch.onClick}
            className={`h-12 w-full shrink-0 rounded-[16px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${
              swatch.isActive
                ? 'border-[#cfd5e6] ring-2 ring-[#edf2ff]'
                : 'border-white/80'
            } ${swatch.previewClassName}`}
            aria-label={swatch.id}
          />
        ))}
      </div>
    </aside>
  )
}
