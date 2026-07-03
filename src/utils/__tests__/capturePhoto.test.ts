import { describe, expect, it, vi } from 'vitest'
import { capturePhoto } from '../capturePhoto'

type MockContext = {
  drawImage: ReturnType<typeof vi.fn>
  restore: ReturnType<typeof vi.fn>
  save: ReturnType<typeof vi.fn>
  scale: ReturnType<typeof vi.fn>
  set filter(value: string)
  translate: ReturnType<typeof vi.fn>
}

function createMockCanvas() {
  let filterValue = 'none'
  const filterHistory: string[] = []

  const context: MockContext = {
    drawImage: vi.fn(),
    restore: vi.fn(),
    save: vi.fn(),
    scale: vi.fn(),
    set filter(value: string) {
      filterValue = value
      filterHistory.push(value)
    },
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
      frameImage: null,
      frameId: 'none',
      photoFilterId: 'clean',
      isBlurred: false,
      video,
    })

    expect(canvas.width).toBe(1152)
    expect(canvas.height).toBe(720)
    expect(context.save).toHaveBeenCalledTimes(1)
    expect(context.translate).toHaveBeenCalledWith(1152, 0)
    expect(context.scale).toHaveBeenCalledWith(-1, 1)
    expect(context.drawImage).toHaveBeenCalledWith(
      video,
      64,
      0,
      1152,
      720,
      0,
      0,
      1152,
      720,
    )
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
      frameImage: null,
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
    expect(canvas.width).toBe(640)
    expect(canvas.height).toBe(400)
    expect(context.drawImage).toHaveBeenCalledWith(
      video,
      0,
      120,
      640,
      400,
      0,
      0,
      640,
      400,
    )
  })

  it('draws the selected frame on top of the captured photo', () => {
    const { canvas, context } = createMockCanvas()
    const video = {
      videoHeight: 623,
      videoWidth: 1013,
    } as HTMLVideoElement
    const frameImage = { tagName: 'IMG' } as unknown as HTMLImageElement

    capturePhoto({
      canvas,
      frameImage,
      frameId: 'classic',
      photoFilterId: 'clean',
      isBlurred: false,
      video,
    })

    expect(canvas.width).toBe(1013)
    expect(canvas.height).toBe(623)
    expect(context.drawImage).toHaveBeenNthCalledWith(
      1,
      video,
      0,
      0,
      1013,
      623,
      0,
      0,
      1013,
      623,
    )
    const frameDrawCall = context.drawImage.mock.calls[1]

    expect(frameDrawCall?.[0]).toBe(frameImage)
    expect(frameDrawCall?.[1]).toBeCloseTo(-151.95)
    expect(frameDrawCall?.[2]).toBeCloseTo(-93.45)
    expect(frameDrawCall?.[3]).toBeCloseTo(1316.9)
    expect(frameDrawCall?.[4]).toBeCloseTo(809.9)
  })
})
