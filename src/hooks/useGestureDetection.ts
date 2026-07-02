export type GestureDetectionState = {
  gestureName: string | null
  gestureScore: number | null
  isPeaceDetected: boolean
  isModelLoading: boolean
  gestureError: string | null
}

export function useGestureDetection(): GestureDetectionState {
  return {
    gestureName: null,
    gestureScore: null,
    isPeaceDetected: false,
    isModelLoading: false,
    gestureError: null,
  }
}
