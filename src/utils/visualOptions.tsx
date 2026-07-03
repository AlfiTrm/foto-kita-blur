import type { CSSProperties, ReactNode, RefObject } from 'react'
import frame1 from '../assets/frame/frame-1.png'
import frame2 from '../assets/frame/frame-2.png'
import frame3 from '../assets/frame/frame-3.png'
import type { FilterPresetId, FramePresetId } from '../types/visual'

export type FilterPreset = {
  id: FilterPresetId
  label: string
  previewClassName: string
}

export type FramePreset = {
  assetSrc?: string
  id: FramePresetId
  label: string
  overlayScale?: number
  previewClassName: string
  previewStyle?: CSSProperties
  stageAspectRatio?: number
}

type SvgFrameOptions = {
  accent?: string
  border: string
  bowMode?: 'many' | 'none'
  innerBorder?: string
  stripe?: boolean
}

const SVG_FRAME_WIDTH = 1600
const SVG_FRAME_HEIGHT = 1000
const DEFAULT_STAGE_ASPECT_RATIO = 16 / 10

function createFramePreviewStyle(assetSrc: string): CSSProperties {
  return {
    backgroundImage: `url(${assetSrc})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  }
}

function createBowMarkup(
  centerX: number,
  centerY: number,
  accent: string,
  border: string,
  rotation = 0,
): string {
  return `
    <g transform="translate(${centerX} ${centerY}) rotate(${rotation})">
      <ellipse cx="-34" cy="0" rx="34" ry="22" fill="${accent}" />
      <ellipse cx="34" cy="0" rx="34" ry="22" fill="${accent}" />
      <rect x="-12" y="-16" width="24" height="32" rx="12" fill="${border}" />
      <path d="M-54 18 -24 6 -22 52Z" fill="${accent}" />
      <path d="M54 18 24 6 22 52Z" fill="${accent}" />
    </g>
  `
}

function createRepeatedBows(accent: string, border: string): string {
  const bowPositions = [
    [260, 102, 0],
    [510, 102, 0],
    [800, 102, 0],
    [1090, 102, 0],
    [1340, 102, 0],
    [260, 898, 180],
    [510, 898, 180],
    [800, 898, 180],
    [1090, 898, 180],
    [1340, 898, 180],
    [102, 270, -90],
    [102, 730, -90],
    [1498, 270, 90],
    [1498, 730, 90],
  ] as const

  return bowPositions
    .map(([x, y, rotation]) => createBowMarkup(x, y, accent, border, rotation))
    .join('')
}

function buildSvgFrameDataUrl({
  accent = '#ffffff',
  border,
  bowMode = 'none',
  innerBorder = 'rgba(255,255,255,0.7)',
  stripe = false,
}: SvgFrameOptions): string {
  const borderFill = stripe
    ? `
      <pattern id="frame-pattern" patternUnits="userSpaceOnUse" width="28" height="28" patternTransform="rotate(45)">
        <rect width="28" height="28" fill="${border}" />
        <rect width="14" height="28" fill="${accent}" />
      </pattern>
    `
    : `
      <linearGradient id="frame-pattern" x1="80" x2="1520" y1="80" y2="920" gradientUnits="userSpaceOnUse">
        <stop stop-color="${accent}" offset="0" />
        <stop stop-color="${border}" offset="0.5" />
        <stop stop-color="${accent}" offset="1" />
      </linearGradient>
    `

  const bows = bowMode === 'many' ? createRepeatedBows(accent, border) : ''

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_FRAME_WIDTH} ${SVG_FRAME_HEIGHT}" fill="none">
      <defs>
        ${borderFill}
        <mask id="frame-border-mask">
          <rect width="${SVG_FRAME_WIDTH}" height="${SVG_FRAME_HEIGHT}" rx="34" fill="white" />
          <rect x="132" y="132" width="1336" height="736" rx="18" fill="black" />
        </mask>
      </defs>
      <rect width="${SVG_FRAME_WIDTH}" height="${SVG_FRAME_HEIGHT}" fill="transparent" />
      <rect
        x="0"
        y="0"
        width="${SVG_FRAME_WIDTH}"
        height="${SVG_FRAME_HEIGHT}"
        rx="34"
        fill="url(#frame-pattern)"
        mask="url(#frame-border-mask)"
      />
      <rect x="52" y="52" width="1496" height="896" rx="28" stroke="${border}" stroke-width="22" />
      <rect x="126" y="126" width="1348" height="748" rx="18" stroke="${innerBorder}" stroke-width="10" />
      <circle cx="112" cy="112" r="10" fill="${accent}" opacity="0.9" />
      <circle cx="1488" cy="112" r="10" fill="${accent}" opacity="0.9" />
      <circle cx="112" cy="888" r="10" fill="${accent}" opacity="0.9" />
      <circle cx="1488" cy="888" r="10" fill="${accent}" opacity="0.9" />
      ${bows}
    </svg>
  `.trim()

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const basicPinkFrame = buildSvgFrameDataUrl({
  accent: '#ffe3f0',
  border: '#f6abc9',
  innerBorder: '#fff8fc',
})

const basicBlackFrame = buildSvgFrameDataUrl({
  accent: '#565765',
  border: '#15161d',
  innerBorder: '#f5f7fb',
})

const basicBlueFrame = buildSvgFrameDataUrl({
  accent: '#dcedff',
  border: '#72a8ff',
  innerBorder: '#f7fbff',
})

const basicGreenFrame = buildSvgFrameDataUrl({
  accent: '#dcfbe8',
  border: '#73d5a0',
  innerBorder: '#f7fff9',
})

const stripePinkFrame = buildSvgFrameDataUrl({
  accent: '#ffd8eb',
  border: '#f3a5ca',
  innerBorder: '#fff7fb',
  stripe: true,
})

const miniRibbonFrame = buildSvgFrameDataUrl({
  accent: '#ffe4f1',
  border: '#ef9fc4',
  bowMode: 'many',
  innerBorder: '#fff8fc',
})

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
  {
    id: 'grayscale',
    label: 'Mono',
    previewClassName:
      'bg-[linear-gradient(135deg,#f4f5f7_0%,#c7ccd6_50%,#8a92a3_100%)]',
  },
]

export const FRAME_PRESETS: FramePreset[] = [
  {
    id: 'none',
    label: 'None',
    previewClassName: 'bg-[linear-gradient(135deg,#f7f8fb_0%,#eef1f7_100%)]',
  },
  {
    id: 'pink',
    label: 'Pink',
    assetSrc: basicPinkFrame,
    overlayScale: 1,
    previewClassName: 'bg-[#fff7fb]',
    previewStyle: createFramePreviewStyle(basicPinkFrame),
    stageAspectRatio: DEFAULT_STAGE_ASPECT_RATIO,
  },
  {
    id: 'black',
    label: 'Black',
    assetSrc: basicBlackFrame,
    overlayScale: 1,
    previewClassName: 'bg-[#f3f4f8]',
    previewStyle: createFramePreviewStyle(basicBlackFrame),
    stageAspectRatio: DEFAULT_STAGE_ASPECT_RATIO,
  },
  {
    id: 'blue',
    label: 'Blue',
    assetSrc: basicBlueFrame,
    overlayScale: 1,
    previewClassName: 'bg-[#f3f8ff]',
    previewStyle: createFramePreviewStyle(basicBlueFrame),
    stageAspectRatio: DEFAULT_STAGE_ASPECT_RATIO,
  },
  {
    id: 'green',
    label: 'Green',
    assetSrc: basicGreenFrame,
    overlayScale: 1,
    previewClassName: 'bg-[#f2fff7]',
    previewStyle: createFramePreviewStyle(basicGreenFrame),
    stageAspectRatio: DEFAULT_STAGE_ASPECT_RATIO,
  },
  {
    id: 'stripe-pink',
    label: 'Stripe',
    assetSrc: stripePinkFrame,
    overlayScale: 1,
    previewClassName: 'bg-[#fff5fa]',
    previewStyle: createFramePreviewStyle(stripePinkFrame),
    stageAspectRatio: DEFAULT_STAGE_ASPECT_RATIO,
  },
  {
    id: 'mini-ribbon',
    label: 'Bow',
    assetSrc: miniRibbonFrame,
    overlayScale: 1,
    previewClassName: 'bg-[#fff6fb]',
    previewStyle: createFramePreviewStyle(miniRibbonFrame),
    stageAspectRatio: DEFAULT_STAGE_ASPECT_RATIO,
  },
  {
    id: 'classic',
    label: 'Classic',
    assetSrc: frame1,
    overlayScale: 1.3,
    previewClassName: 'bg-[#fff7fb]',
    previewStyle: createFramePreviewStyle(frame1),
    stageAspectRatio: 8104 / 4984,
  },
  {
    id: 'ribbon',
    label: 'Ribbon',
    assetSrc: frame2,
    overlayScale: 1.3,
    previewClassName: 'bg-[#fff8f1]',
    previewStyle: createFramePreviewStyle(frame2),
    stageAspectRatio: 7568 / 5028,
  },
  {
    id: 'spark',
    label: 'Spark',
    assetSrc: frame3,
    overlayScale: 1.3,
    previewClassName: 'bg-[#fffaf0]',
    previewStyle: createFramePreviewStyle(frame3),
    stageAspectRatio: 7568 / 5028,
  },
]

const FILTER_STYLE_MAP: Record<FilterPresetId, string> = {
  clean: 'none',
  soft: 'saturate(0.92) contrast(0.96) brightness(1.04)',
  glow: 'saturate(1.08) brightness(1.08) contrast(0.94)',
  dream: 'saturate(0.88) contrast(0.9) brightness(1.06) hue-rotate(-8deg)',
  grayscale: 'grayscale(1) contrast(1.02) brightness(1.02)',
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
  'pointer-events-none absolute inset-0 z-10 scale-105 h-full w-full object-contain transition-opacity duration-200'

export function getFrameAssetSrc(frameId: FramePresetId): string | null {
  return FRAME_PRESETS.find((preset) => preset.id === frameId)?.assetSrc ?? null
}

export function getFrameOverlayScale(frameId: FramePresetId): number {
  return FRAME_PRESETS.find((preset) => preset.id === frameId)?.overlayScale ?? 1
}

export function getStageAspectRatio(frameId: FramePresetId): number {
  return (
    FRAME_PRESETS.find((preset) => preset.id === frameId)?.stageAspectRatio ??
    DEFAULT_STAGE_ASPECT_RATIO
  )
}

export function renderFrameOverlay(
  frameId: FramePresetId,
  frameOverlayRef?: RefObject<HTMLImageElement | null>,
): ReactNode {
  const assetSrc = getFrameAssetSrc(frameId)
  const overlayScale = getFrameOverlayScale(frameId)

  if (!assetSrc) {
    return null
  }

  return (
    <img
      ref={frameOverlayRef}
      src={assetSrc}
      alt=""
      aria-hidden="true"
      className={frameBaseClassName}
      style={{ transform: `scale(${overlayScale})` }}
    />
  )
}

export function getPreviewFilterStyle(
  filterId: FilterPresetId,
  isBlurred: boolean,
): CSSProperties {
  return {
    filter: getFilterStyle(filterId, isBlurred),
  }
}
