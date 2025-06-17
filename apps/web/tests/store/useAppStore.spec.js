import { describe, it, expect } from 'vitest'
import { useAppStore } from '../../src/store/useAppStore'

// Zustand uses a singleton store, so we need to reset state between tests
const resetStore = () => {
  useAppStore.setState({ counter: 0 })
}

describe('useAppStore Zustand Store', () => {
  beforeEach(() => {
    resetStore()
  })

  it('should have initial counter value of 0', () => {
    expect(useAppStore.getState().counter).toBe(0)
  })

  it('should increment the counter', () => {
    useAppStore.getState().increment()
    expect(useAppStore.getState().counter).toBe(1)
  })

  it('should reset the counter', () => {
    useAppStore.getState().increment()
    useAppStore.getState().reset()
    expect(useAppStore.getState().counter).toBe(0)
  })
}) 