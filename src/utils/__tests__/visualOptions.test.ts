import { describe, expect, it } from 'vitest'
import { FILTER_PRESETS, getFilterStyle } from '../visualOptions'

describe('visualOptions', () => {
  it('includes grayscale in the filter preset list', () => {
    expect(FILTER_PRESETS.map((preset) => preset.id)).toContain('grayscale')
  })

  it('builds the grayscale filter string with optional blur', () => {
    expect(getFilterStyle('grayscale', false)).toBe(
      'grayscale(1) contrast(1.02) brightness(1.02)',
    )
    expect(getFilterStyle('grayscale', true)).toBe(
      'grayscale(1) contrast(1.02) brightness(1.02) blur(14px)',
    )
  })
})
