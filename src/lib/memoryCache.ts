
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

  // Added remove as an alias for delete to fix the error in useMemoryCache.ts
  remove(key: string): void {
    this.delete(key);
  }

  // Add size getter for CacheExample component
  get size(): number {
    return this.cache.size;
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

// Add CacheKey and CacheOptions types for useMemoryCache.ts
export type CacheKey = string;
export type CacheOptions = {
  ttl?: number;
  background?: boolean;
};

// Cleanup every 5 min
setInterval(() => {
  memoryCache.cleanExpired()
}, 5 * 60 * 1000)
