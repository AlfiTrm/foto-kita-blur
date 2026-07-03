import type { CSSProperties, ReactNode } from 'react'
import type { FilterPresetId, FramePresetId } from '../types/visual'

export type FilterPreset = {
  id: FilterPresetId
  label: string
  previewClassName: string
}

export type FramePreset = {
  id: FramePresetId
  label: string
  previewClassName: string
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'clean',
    label: 'Clean',
    previewClassName:
      'bg-[linear-gradient(135deg,#e8edf7_0%,#bfcbe2_100%)]',
  },
  {
    id: 'soft',
    label: 'Soft',
    previewClassName:
      'bg-[linear-gradient(135deg,#f6e2ec_0%,#efe7ff_100%)]',
  },
  {
    id: 'glow',
    label: 'Glow',
    previewClassName:
      'bg-[linear-gradient(135deg,#ffe3b8_0%,#ffd7ef_100%)]',
  },
  {
    id: 'dream',
    label: 'Dream',
    previewClassName:
      'bg-[linear-gradient(135deg,#d9e7ff_0%,#f5d8ff_100%)]',
  },
]

export const FRAME_PRESETS: FramePreset[] = [
  {
    id: 'none',
    label: 'None',
    previewClassName: 'bg-[linear-gradient(135deg,#f7f8fb_0%,#eef1f7_100%)]',
  },
  {
    id: 'classic',
    label: 'Classic',
    previewClassName:
      'bg-[linear-gradient(135deg,#fff6dd_0%,#ffe8c2_100%)]',
  },
  {
    id: 'ribbon',
    label: 'Ribbon',
    previewClassName:
      'bg-[linear-gradient(135deg,#ffd9ea_0%,#ffc7dd_100%)]',
  },
  {
    id: 'spark',
    label: 'Spark',
    previewClassName:
      'bg-[linear-gradient(135deg,#e1ecff_0%,#d7dbff_100%)]',
  },
]

const FILTER_STYLE_MAP: Record<FilterPresetId, string> = {
  clean: 'none',
  soft: 'saturate(0.92) contrast(0.96) brightness(1.04)',
  glow: 'saturate(1.08) brightness(1.08) contrast(0.94)',
  dream: 'saturate(0.88) contrast(0.9) brightness(1.06) hue-rotate(-8deg)',
}

export function getFilterStyle(
  filterId: FilterPresetId,
  isBlurred: boolean,
): string {
  const filters = [
    FILTER_STYLE_MAP[filterId] === 'none' ? null : FILTER_STYLE_MAP[filterId],
    isBlurred ? 'blur(14px)' : null,
  ].filter(Boolean)

  return filters.length > 0 ? filters.join(' ') : 'none'
}

const frameBaseClassName =
  'pointer-events-none absolute inset-0 rounded-[28px] transition-opacity duration-200'

export function renderFrameOverlay(frameId: FramePresetId): ReactNode {
  switch (frameId) {
    case 'classic':
      return (
        <div className={`${frameBaseClassName} border-[14px] border-[#fff3d2] shadow-[inset_0_0_0_1px_rgba(191,152,104,0.45)]`} />
      )
    case 'ribbon':
      return (
        <div className={frameBaseClassName}>
          <div className="absolute inset-x-0 top-0 h-5 bg-[linear-gradient(90deg,#ffc4dd_0%,#ffd9e9_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-5 bg-[linear-gradient(90deg,#ffd9e9_0%,#ffc4dd_100%)]" />
          <div className="absolute inset-y-0 left-0 w-5 bg-[linear-gradient(180deg,#ffd3e5_0%,#ffbfd8_100%)]" />
          <div className="absolute inset-y-0 right-0 w-5 bg-[linear-gradient(180deg,#ffbfd8_0%,#ffd3e5_100%)]" />
        </div>
      )
    case 'spark':
      return (
        <div className={frameBaseClassName}>
          <div className="absolute inset-4 rounded-[22px] border border-white/65" />
          <div className="absolute left-5 top-5 size-3 rounded-full bg-white/85 shadow-[0_0_18px_rgba(255,255,255,0.9)]" />
          <div className="absolute bottom-7 right-7 size-2 rounded-full bg-[#fff6c7] shadow-[0_0_16px_rgba(255,246,199,0.95)]" />
          <div className="absolute right-10 top-8 size-1.5 rounded-full bg-white/80" />
        </div>
      )
    case 'none':
    default:
      return null
  }
}

export function getPreviewFilterStyle(
  filterId: FilterPresetId,
  isBlurred: boolean,
): CSSProperties {
  return {
    filter: getFilterStyle(filterId, isBlurred),
  }
}
