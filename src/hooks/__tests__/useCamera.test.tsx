import { renderHook, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCamera } from '../useCamera'

type MockTrack = {
  stop: ReturnType<typeof vi.fn>
}

function createMediaStream(trackCount = 1): {
  stream: MediaStream
  tracks: MockTrack[]
} {
  const tracks = Array.from({ length: trackCount }, () => ({
    stop: vi.fn(),
  }))

  return {
    stream: {
      getTracks: () => tracks,
    } as unknown as MediaStream,
    tracks,
  }
}

describe('useCamera', () => {
  const originalMediaDevices = navigator.mediaDevices

  beforeEach(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: vi.fn(),
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: originalMediaDevices,
    })
    vi.restoreAllMocks()
  })

  it('starts the front camera and attaches the stream to the provided video element', async () => {
    const { stream } = createMediaStream()
    const videoRef = createRef<HTMLVideoElement>()
    const video = document.createElement('video')
    video.play = vi.fn().mockResolvedValue(undefined)
    videoRef.current = video

    vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue(stream)

    const { result } = renderHook(() => useCamera(videoRef))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.permissionState).toBe('granted'))

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: false,
      video: {
        facingMode: 'user',
      },
    })
    expect(video.srcObject).toBe(stream)
    expect(video.play).toHaveBeenCalled()
  })

  it('surfaces a permission error when camera access is denied', async () => {
    const videoRef = createRef<HTMLVideoElement>()
    const deniedError = new DOMException('Permission denied', 'NotAllowedError')

    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(deniedError)

    const { result } = renderHook(() => useCamera(videoRef))

    await waitFor(() => expect(result.current.permissionState).toBe('denied'))

    expect(result.current.error).toContain('permission')
    expect(result.current.stream).toBeNull()
  })

  it('stops all active tracks when the hook unmounts', async () => {
    const { stream, tracks } = createMediaStream(2)
    const videoRef = createRef<HTMLVideoElement>()
    const video = document.createElement('video')
    video.play = vi.fn().mockResolvedValue(undefined)
    videoRef.current = video

    vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue(stream)

    const { unmount } = renderHook(() => useCamera(videoRef))

    await waitFor(() =>
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledTimes(1),
    )

    unmount()

    expect(tracks[0].stop).toHaveBeenCalledTimes(1)
    expect(tracks[1].stop).toHaveBeenCalledTimes(1)
  })
})
