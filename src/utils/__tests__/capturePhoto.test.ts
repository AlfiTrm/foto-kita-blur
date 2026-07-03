import { describe, expect, it, vi } from 'vitest'
import { capturePhoto } from '../capturePhoto'

type MockContext = {
  beginPath: ReturnType<typeof vi.fn>
  drawImage: ReturnType<typeof vi.fn>
  fill: ReturnType<typeof vi.fn>
  fillRect: ReturnType<typeof vi.fn>
  restore: ReturnType<typeof vi.fn>
  save: ReturnType<typeof vi.fn>
  scale: ReturnType<typeof vi.fn>
  set filter(value: string)
  set fillStyle(value: string)
  set lineWidth(value: number)
  set shadowBlur(value: number)
  set shadowColor(value: string)
  set strokeStyle(value: string)
  strokeRect: ReturnType<typeof vi.fn>
  translate: ReturnType<typeof vi.fn>
  arc: ReturnType<typeof vi.fn>
}

function createMockCanvas() {
  let filterValue = 'none'
  const filterHistory: string[] = []
  let fillStyleValue = ''
  const fillStyleHistory: string[] = []
  let strokeStyleValue = ''
  const strokeStyleHistory: string[] = []
  let lineWidthValue = 0

  const context: MockContext = {
    arc: vi.fn(),
    beginPath: vi.fn(),
    drawImage: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    restore: vi.fn(),
    save: vi.fn(),
    scale: vi.fn(),
    set filter(value: string) {
      filterValue = value
      filterHistory.push(value)
    },
    set fillStyle(value: string) {
      fillStyleValue = value
      fillStyleHistory.push(value)
    },
    set lineWidth(value: number) {
      lineWidthValue = value
    },
    set shadowBlur(_value: number) {},
    set shadowColor(_value: string) {},
    set strokeStyle(value: string) {
      strokeStyleValue = value
      strokeStyleHistory.push(value)
    },
    strokeRect: vi.fn(),
    translate: vi.fn(),
  }

  const canvas = {
    getContext: vi.fn(() => context),
    height: 0,
    toDataURL: vi.fn(() => 'data:image/jpeg;base64,photo'),
    width: 0,
  } as unknown as HTMLCanvasElement

  return {
    canvas,
    context,
    getFilter: () => filterValue,
    getFilterHistory: () => filterHistory,
    getFillStyle: () => fillStyleValue,
    getFillStyleHistory: () => fillStyleHistory,
    getLineWidth: () => lineWidthValue,
    getStrokeStyle: () => strokeStyleValue,
    getStrokeStyleHistory: () => strokeStyleHistory,
  }
}

describe('capturePhoto', () => {
  it('captures a mirrored jpeg from the current video frame', () => {
    const { canvas, context, getFilter } = createMockCanvas()
    const video = {
      videoHeight: 720,
      videoWidth: 1280,
    } as HTMLVideoElement

    const result = capturePhoto({
      canvas,
      frameId: 'none',
      photoFilterId: 'clean',
      isBlurred: false,
      video,
    })

    expect(canvas.width).toBe(1280)
    expect(canvas.height).toBe(720)
    expect(context.save).toHaveBeenCalledTimes(1)
    expect(context.translate).toHaveBeenCalledWith(1280, 0)
    expect(context.scale).toHaveBeenCalledWith(-1, 1)
    expect(context.drawImage).toHaveBeenCalledWith(video, 0, 0, 1280, 720)
    expect(context.restore).toHaveBeenCalledTimes(1)
    expect(getFilter()).toBe('none')
    expect(result).toBe('data:image/jpeg;base64,photo')
  })

  it('applies blur to the captured output when peace blur is active', () => {
    const { canvas, context, getFilter, getFilterHistory } = createMockCanvas()
    const video = {
      videoHeight: 640,
      videoWidth: 640,
    } as HTMLVideoElement

    capturePhoto({
      canvas,
      frameId: 'none',
      photoFilterId: 'dream',
      isBlurred: true,
      video,
    })

    expect(getFilterHistory()).toEqual([
      'saturate(0.88) contrast(0.9) brightness(1.06) hue-rotate(-8deg) blur(14px)',
      'none',
    ])
    expect(getFilter()).toBe('none')
    expect(context.drawImage).toHaveBeenCalledWith(video, 0, 0, 640, 640)
  })

  it('draws the selected frame on top of the captured photo', () => {
    const {
      canvas,
      context,
      getLineWidth,
      getStrokeStyle,
      getStrokeStyleHistory,
    } = createMockCanvas()
    const video = {
      videoHeight: 960,
      videoWidth: 960,
    } as HTMLVideoElement

    capturePhoto({
      canvas,
      frameId: 'classic',
      photoFilterId: 'clean',
      isBlurred: false,
      video,
    })

    expect(context.strokeRect).toHaveBeenCalledWith(7, 7, 946, 946)
    expect(getLineWidth()).toBe(2)
    expect(getStrokeStyle()).toBe('#bf9868')
    expect(getStrokeStyleHistory()[0]).toBe('#fff3d2')
    expect(getStrokeStyleHistory()).toContain('#fff3d2')
  })
})
