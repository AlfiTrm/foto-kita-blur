import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { CameraState } from '../types/camera'

const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: 'user',
  },
}

function getErrorMessage(error: unknown) {
  if (error instanceof DOMException && error.name === 'NotAllowedError') {
    return 'Camera permission was denied. Please allow access to continue.'
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Unable to access the camera right now.'
}

export function useCamera(
  videoRef: RefObject<HTMLVideoElement | null>,
): CameraState {
  const isSupported =
    typeof navigator !== 'undefined' && 'mediaDevices' in navigator
  const streamRef = useRef<MediaStream | null>(null)
  const [permissionState, setPermissionState] = useState<
    CameraState['permissionState']
  >('idle')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(isSupported)

  const stopCamera = useCallback(() => {
    const currentStream = streamRef.current

    if (!currentStream) {
      return
    }

    currentStream.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStream(null)

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [videoRef])

  const startCamera = useCallback(async () => {
    if (!isSupported) {
      setError('Camera is not supported in this browser.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    setPermissionState('prompt')

    try {
      const nextStream =
        await navigator.mediaDevices.getUserMedia(DEFAULT_CONSTRAINTS)
      streamRef.current = nextStream
      setStream(nextStream)
      setPermissionState('granted')

      const videoElement = videoRef.current

      if (videoElement) {
        videoElement.srcObject = nextStream
        await videoElement.play()
      }
    } catch (cameraError) {
      setPermissionState(
        cameraError instanceof DOMException &&
          cameraError.name === 'NotAllowedError'
          ? 'denied'
          : 'idle',
      )
      setError(getErrorMessage(cameraError))
      stopCamera()
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, stopCamera, videoRef])

  useEffect(() => {
    void startCamera()

    return () => {
      stopCamera()
    }
  }, [startCamera, stopCamera])

  return {
    permissionState,
    stream,
    error,
    isLoading,
    isSupported,
    startCamera,
    stopCamera,
  }
}
