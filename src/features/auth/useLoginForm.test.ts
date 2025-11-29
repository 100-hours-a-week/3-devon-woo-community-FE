import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLoginForm } from './useLoginForm'
import { TestFixture } from '@/test/TestFixture'

vi.mock('./AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue(undefined),
    signup: vi.fn(),
    logout: vi.fn(),
    user: null,
  }),
}))

describe('useLoginForm', () => {
  it('should initialize with empty values', () => {
    const { result } = renderHook(() => useLoginForm(), {
      wrapper: TestFixture,
    })

    expect(result.current.email).toBe('')
    expect(result.current.password).toBe('')
    expect(result.current.error).toBe('')
    expect(result.current.isLoading).toBe(false)
  })

  it('should update email state', () => {
    const { result } = renderHook(() => useLoginForm(), {
      wrapper: TestFixture,
    })

    act(() => {
      result.current.setEmail('test@example.com')
    })

    expect(result.current.email).toBe('test@example.com')
  })

  it('should update password state', () => {
    const { result } = renderHook(() => useLoginForm(), {
      wrapper: TestFixture,
    })

    act(() => {
      result.current.setPassword('password123')
    })

    expect(result.current.password).toBe('password123')
  })

  it('should clear error on input change', () => {
    const { result } = renderHook(() => useLoginForm(), {
      wrapper: TestFixture,
    })

    act(() => {
      result.current.setError('Some error')
    })

    expect(result.current.error).toBe('Some error')

    act(() => {
      result.current.handleInputChange()
    })

    expect(result.current.error).toBe('')
  })

  it('should call onSuccess on successful login', async () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useLoginForm({ onSuccess }), {
      wrapper: TestFixture,
    })

    act(() => {
      result.current.setEmail('test@example.com')
      result.current.setPassword('password123')
    })

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent

    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    expect(onSuccess).toHaveBeenCalled()
  })
})
