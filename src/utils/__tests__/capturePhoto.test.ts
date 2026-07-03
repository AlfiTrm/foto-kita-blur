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
      isBlurred: true,
      video,
    })

    expect(getFilterHistory()).toEqual(['blur(14px)', 'none'])
    expect(getFilter()).toBe('none')
    expect(context.drawImage).toHaveBeenCalledWith(video, 0, 0, 640, 640)
  })
})
