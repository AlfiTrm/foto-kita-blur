import { useEffect, useRef, useState } from 'react'

const PEACE_BLUR_ON_DELAY_MS = 120
const PEACE_BLUR_OFF_DELAY_MS = 220

export function useStablePeace(isDetected: boolean) {
  const [isStable, setIsStable] = useState(isDetected)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    if (isDetected) {
      timeoutRef.current = window.setTimeout(() => {
        setIsStable(true)
      }, PEACE_BLUR_ON_DELAY_MS)
    } else {
      timeoutRef.current = window.setTimeout(() => {
        setIsStable(false)
      }, PEACE_BLUR_OFF_DELAY_MS)
    }

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [isDetected])

  return isStable
}
