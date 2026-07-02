import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  createGestureRecognizer,
  GESTURE_DETECTION_INTERVAL_MS,
  PEACE_GESTURE_CONFIDENCE_THRESHOLD,
  PEACE_GESTURE_NAME,
  type GestureCategory,
  type GestureRecognizerLike,
} from '../lib/mediapipe'

export type GestureDetectionState = {
  gestureName: string | null
  gestureScore: number | null
  isPeaceDetected: boolean
  isModelLoading: boolean
  gestureError: string | null
}

const INITIAL_STATE: GestureDetectionState = {
  gestureName: null,
  gestureScore: null,
  isPeaceDetected: false,
  isModelLoading: false,
  gestureError: null,
}

function getTopGesture(
  recognizerResult: ReturnType<GestureRecognizerLike['recognizeForVideo']>,
): GestureCategory | null {
  return recognizerResult.gestures[0]?.[0] ?? null
}

export function useGestureDetection(
  videoRef: RefObject<HTMLVideoElement | null>,
  isEnabled: boolean,
): GestureDetectionState {
  const recognizerRef = useRef<GestureRecognizerLike | null>(null)
  const frameIdRef = useRef<number | null>(null)
  const lastRunAtRef = useRef(0)
  const [state, setState] = useState<GestureDetectionState>(INITIAL_STATE)

  useEffect(() => {
    if (!isEnabled) {
      setState(INITIAL_STATE)
      return
    }

    let isDisposed = false

    setState((current) => ({
      ...current,
      isModelLoading: true,
      gestureError: null,
    }))

    const tick = (timestamp: number) => {
      if (isDisposed) {
        return
      }

      const videoElement = videoRef.current
      const recognizer = recognizerRef.current

      if (
        !videoElement ||
        !recognizer ||
        videoElement.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        frameIdRef.current = requestAnimationFrame(tick)
        return
      }

      if (timestamp - lastRunAtRef.current < GESTURE_DETECTION_INTERVAL_MS) {
        frameIdRef.current = requestAnimationFrame(tick)
        return
      }

      lastRunAtRef.current = timestamp

      const topGesture = getTopGesture(
        recognizer.recognizeForVideo(videoElement, timestamp),
      )
      const gestureName = topGesture?.categoryName ?? null
      const gestureScore = topGesture?.score ?? null
      const isPeaceDetected =
        gestureName === PEACE_GESTURE_NAME &&
        gestureScore !== null &&
        gestureScore >= PEACE_GESTURE_CONFIDENCE_THRESHOLD

      setState((current) => {
        if (
          current.gestureName === gestureName &&
          current.gestureScore === gestureScore &&
          current.isPeaceDetected === isPeaceDetected &&
          current.isModelLoading === false &&
          current.gestureError === null
        ) {
          return current
        }

        return {
          gestureName,
          gestureScore,
          isPeaceDetected,
          isModelLoading: false,
          gestureError: null,
        }
      })

      frameIdRef.current = requestAnimationFrame(tick)
    }

    void createGestureRecognizer()
      .then((recognizer) => {
        if (isDisposed) {
          recognizer.close?.()
          return
        }

        recognizerRef.current = recognizer
        lastRunAtRef.current = 0
        frameIdRef.current = requestAnimationFrame(tick)
      })
      .catch((error: unknown) => {
        if (isDisposed) {
          return
        }

        setState({
          ...INITIAL_STATE,
          isModelLoading: false,
          gestureError:
            error instanceof Error
              ? error.message
              : 'Unable to load gesture detection.',
        })
      })

    return () => {
      isDisposed = true

      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current)
      }

      recognizerRef.current?.close?.()
      recognizerRef.current = null
      frameIdRef.current = null
    }
  }, [isEnabled, videoRef])

  return state
}
