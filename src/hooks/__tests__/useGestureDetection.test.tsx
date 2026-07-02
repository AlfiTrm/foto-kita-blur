import { renderHook, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGestureDetection } from '../useGestureDetection'
import * as mediapipe from '../../lib/mediapipe'

type MockRecognizer = {
  close: ReturnType<typeof vi.fn>
  recognizeForVideo: ReturnType<typeof vi.fn>
}

function createVideoRef() {
  const videoRef = createRef<HTMLVideoElement>()
  const video = document.createElement('video')

  Object.defineProperty(video, 'readyState', {
    configurable: true,
    get: () => 3,
  })

  videoRef.current = video
  return videoRef
}

describe('useGestureDetection', () => {
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame

  beforeEach(() => {
    let hasExecutedFrame = false
    let frameId = 0

    vi.spyOn(performance, 'now').mockReturnValue(200)
    globalThis.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      frameId += 1

      if (!hasExecutedFrame) {
        hasExecutedFrame = true
        queueMicrotask(() => callback(200))
      }

      return frameId
    })
    globalThis.cancelAnimationFrame = vi.fn()
  })

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRequestAnimationFrame
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame
    vi.restoreAllMocks()
  })

  it('marks peace as detected when the top gesture is Victory above the threshold', async () => {
    const recognizer: MockRecognizer = {
      recognizeForVideo: vi.fn().mockReturnValue({
        gestures: [[{ categoryName: 'Victory', score: 0.91 }]],
      }),
      close: vi.fn(),
    }

    vi.spyOn(mediapipe, 'createGestureRecognizer').mockResolvedValue(
      recognizer as never,
    )

    const videoRef = createVideoRef()
    const { result } = renderHook(() => useGestureDetection(videoRef, true))

    await waitFor(() => expect(result.current.isPeaceDetected).toBe(true))

    expect(result.current.gestureName).toBe('Victory')
    expect(result.current.gestureScore).toBe(0.91)
  })

  it('keeps peace false when the recognized gesture is not Victory', async () => {
    const recognizer: MockRecognizer = {
      recognizeForVideo: vi.fn().mockReturnValue({
        gestures: [[{ categoryName: 'Open_Palm', score: 0.97 }]],
      }),
      close: vi.fn(),
    }

    vi.spyOn(mediapipe, 'createGestureRecognizer').mockResolvedValue(
      recognizer as never,
    )

    const videoRef = createVideoRef()
    const { result } = renderHook(() => useGestureDetection(videoRef, true))

    await waitFor(() => expect(result.current.isModelLoading).toBe(false))

    expect(result.current.isPeaceDetected).toBe(false)
    expect(result.current.gestureName).toBe('Open_Palm')
  })

  it('cancels the frame loop and closes the recognizer on unmount', async () => {
    const recognizer: MockRecognizer = {
      recognizeForVideo: vi.fn().mockReturnValue({ gestures: [] }),
      close: vi.fn(),
    }

    vi.spyOn(mediapipe, 'createGestureRecognizer').mockResolvedValue(
      recognizer as never,
    )

    const videoRef = createVideoRef()
    const { unmount } = renderHook(() => useGestureDetection(videoRef, true))

    await waitFor(() =>
      expect(mediapipe.createGestureRecognizer).toHaveBeenCalledTimes(1),
    )

    unmount()

    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled()
    expect(recognizer.close).toHaveBeenCalledTimes(1)
  })
})
