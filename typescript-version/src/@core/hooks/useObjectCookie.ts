// React Imports
import { useMemo } from 'react'

// Third-party Imports
import { useCookie } from 'react-use'

export const useObjectCookie = <T>(key: string, fallback?: T | null): [T, (newVal: T) => void] => {
  // Hooks
  const [valStr, updateCookie] = useCookie(key)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo<T>(() => (valStr ? JSON.parse(valStr) : fallback), [valStr])

  const updateValue = (newVal: T) => {
    updateCookie(JSON.stringify(newVal))
  }

  return [value, updateValue]
}
