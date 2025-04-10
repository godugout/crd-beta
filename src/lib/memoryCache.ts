
// lib/memoryCache.ts

class MemoryCache {
  private cache: Map<string, { data: any; expiry: number }> = new Map()

  set(key: string, data: any, ttlSeconds = 300): void {
    const expiry = Date.now() + ttlSeconds * 1000
    this.cache.set(key, { data, expiry })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null
    if (Date.now() > item.expiry) {
      this.delete(key)
      return null
    }
    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false
    if (Date.now() > item.expiry) {
      this.delete(key)
      return false
    }
    return true
  }

  clear(): void {
    this.cache.clear()
  }

  async getOrFetch<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds = 300): Promise<T> {
    const cachedData = this.get(key)
    if (cachedData !== null) {
      return cachedData as T
    }
    const freshData = await fetchFn()
    this.set(key, freshData, ttlSeconds)
    return freshData
  }

  cleanExpired(): void {
    const now = Date.now()
    for (const [key, { expiry }] of this.cache.entries()) {
      if (now > expiry) {
        this.cache.delete(key)
      }
    }
  }
}

export const memoryCache = new MemoryCache()

// Cleanup every 5 min
setInterval(() => {
  memoryCache.cleanExpired()
}, 5 * 60 * 1000)
