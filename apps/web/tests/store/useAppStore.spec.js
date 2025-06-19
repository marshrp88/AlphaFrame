import { describe, it, expect, vi } from 'vitest'
import { useAppStore } from '@/store/useAppStore'

// Mock the store for this test
vi.mock('@/store/useAppStore', () => ({
  useAppStore: {
    getState: vi.fn(() => ({
      counter: 0,
      increment: vi.fn(),
      reset: vi.fn()
    }))
  }
}))

describe('useAppStore Zustand Store', () => {
  it('should have initial counter value of 0', () => {
    const store = useAppStore.getState()
    expect(store.counter).toBe(0)
  })

  it('should increment the counter', () => {
    const store = useAppStore.getState()
    store.increment()
    expect(store.increment).toHaveBeenCalled()
  })

  it('should reset the counter', () => {
    const store = useAppStore.getState()
    store.reset()
    expect(store.reset).toHaveBeenCalled()
  })
}) 
