'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type CacheEntry = {
  data: any
  timestamp: number
}

type DataCacheContextType = {
  cache: Record<string, CacheEntry>
  getCachedData: (key: string) => any | null
  setCachedData: (key: string, data: any) => void
  invalidateCache: (key: string) => void
  invalidateAll: () => void
}

const DataCacheContext = createContext<DataCacheContextType | undefined>(undefined)

export function DataCacheProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<Record<string, CacheEntry>>({})

  const getCachedData = useCallback((key: string) => {
    return cache[key]?.data || null
  }, [cache])

  const setCachedData = useCallback((key: string, data: any) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now()
      }
    }))
  }, [])

  const invalidateCache = useCallback((key: string) => {
    setCache(prev => {
      const newCache = { ...prev }
      delete newCache[key]
      return newCache
    })
  }, [])

  const invalidateAll = useCallback(() => {
    setCache({})
  }, [])

  return (
    <DataCacheContext.Provider value={{ cache, getCachedData, setCachedData, invalidateCache, invalidateAll }}>
      {children}
    </DataCacheContext.Provider>
  )
}

export function useDataCache() {
  const context = useContext(DataCacheContext)
  if (!context) {
    throw new Error('useDataCache must be used within DataCacheProvider')
  }
  return context
}
