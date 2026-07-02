import {
  FilesetResolver,
  GestureRecognizer,
  type Category,
} from '@mediapipe/tasks-vision'

export const MEDIAPIPE_WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'

export const GESTURE_RECOGNIZER_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task'

export const PEACE_GESTURE_NAME = 'Victory'

export const PEACE_GESTURE_CONFIDENCE_THRESHOLD = 0.7

export const GESTURE_DETECTION_INTERVAL_MS = 100

export type GestureCategory = Pick<Category, 'categoryName' | 'score'>

export type GestureRecognizerResultLike = {
  gestures: GestureCategory[][]
}

export type GestureRecognizerLike = {
  recognizeForVideo: (
    video: HTMLVideoElement,
    timestamp: number,
  ) => GestureRecognizerResultLike
  close?: () => void
}

export async function createGestureRecognizer(): Promise<GestureRecognizerLike> {
  const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL)

  return GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: GESTURE_RECOGNIZER_MODEL_URL,
    },
    runningMode: 'VIDEO',
    numHands: 1,
  })
}
