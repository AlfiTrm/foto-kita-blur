import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useStablePeace } from '../useStablePeace'

describe('useStablePeace', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('waits briefly before enabling the blur state', () => {
    const { result, rerender } = renderHook(
      ({ isDetected }) => useStablePeace(isDetected),
      {
        initialProps: { isDetected: false },
      },
    )

    rerender({ isDetected: true })

    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(119)
    })

    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(result.current).toBe(true)
  })

  it('keeps blur active briefly after the gesture disappears', () => {
    const { result, rerender } = renderHook(
      ({ isDetected }) => useStablePeace(isDetected),
      {
        initialProps: { isDetected: true },
      },
    )

    act(() => {
      vi.advanceTimersByTime(120)
    })

    expect(result.current).toBe(true)

    rerender({ isDetected: false })

    act(() => {
      vi.advanceTimersByTime(219)
    })

    expect(result.current).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(result.current).toBe(false)
  })
})
