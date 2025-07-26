import { useState, useCallback, useEffect } from 'react'
import { handleError } from '@/utils/errorHandler'

interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseAsyncOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
  showErrorAlert?: boolean
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  options: UseAsyncOptions = {}
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await asyncFunction()
      setState({ data, loading: false, error: null })
      options.onSuccess?.()
      return data
    } catch (error) {
      const errorMessage = handleError(
        error, 
        'useAsync', 
        options.showErrorAlert ?? false
      )
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      options.onError?.(errorMessage)
      throw error
    }
  }, [asyncFunction, options])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return {
    ...state,
    execute,
    refetch: execute
  }
}

// 데이터 변형을 위한 Hook
export function useAsyncCallback<TArgs extends any[], TResult>(
  callback: (...args: TArgs) => Promise<TResult>,
  options: UseAsyncOptions = {}
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (...args: TArgs) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await callback(...args)
      setLoading(false)
      options.onSuccess?.()
      return result
    } catch (error) {
      const errorMessage = handleError(
        error,
        'useAsyncCallback',
        options.showErrorAlert ?? true
      )
      setError(errorMessage)
      setLoading(false)
      options.onError?.(errorMessage)
      throw error
    }
  }, [callback, options])

  return {
    execute,
    loading,
    error
  }
}