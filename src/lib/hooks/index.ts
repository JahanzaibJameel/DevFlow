'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Hook for managing async operations
 */
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true,
  dependencies: unknown[] = []
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)
    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error as E)
      setStatus('error')
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, dependencies)

  return { execute, status, data, error }
}

/**
 * Hook for managing local storage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue
      }
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch {
        console.error(`Error setting localStorage key "${key}":`)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue] as const
}

/**
 * Hook for managing session storage
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue
      }
      const item = window.sessionStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch {
        console.error(`Error setting sessionStorage key "${key}":`)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue] as const
}

/**
 * Hook for managing debounced values
 */
export function useDebounce<T>(value: T, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => clearTimeout(handler)
  }, [value, delayMs])

  return debouncedValue
}

/**
 * Hook for managing throttled values
 */
export function useThrottle<T>(value: T, delayMs: number) {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastRanRef = useCallback(() => Date.now(), [])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRanRef() >= delayMs) {
        setThrottledValue(value)
      }
    }, delayMs - (Date.now() - lastRanRef()))

    return () => clearTimeout(handler)
  }, [value, delayMs, lastRanRef])

  return throttledValue
}

/**
 * Hook for handling click outside
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
) {
  const ref = useCallback((node: T | null) => {
    if (!node) return

    const handleClick = (event: MouseEvent) => {
      if (!node.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [callback])

  return ref
}

/**
 * Hook for detecting if component is in viewport
 */
export function useInView(options?: IntersectionObserverInit) {
  const [inView, setInView] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.unobserve(entry.target)
      }
    }, options)

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, options])

  return { ref: setRef, inView }
}

/**
 * Hook for managing previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useState<T | undefined>(undefined)

  useEffect(() => {
    ref[0] = value
  }, [value])

  return ref[0]
}

/**
 * Hook for managing copy to clipboard
 */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Failed to copy')
    }
  }, [])

  return { copy, copied }
}
