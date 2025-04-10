
/**
 * MemoryCache - A simple in-memory cache with TTL support
 * 
 * Features:
 * - Cache data with configurable TTL (Time To Live)
 * - Auto cleanup of expired items
 * - Fetch-and-cache functionality for cache misses
 * - Typescript generics for type safety
 */

// Type definitions
export type CacheKey = string;

export interface CacheItem<T> {
  data: T;
  expiry: number;
}

export type FetchFunction<T> = () => Promise<T>;

export interface CacheOptions {
  /** 
   * Time to live in seconds (default: 300s, max: 3600s)
   */
  ttlSeconds?: number;
}

export class MemoryCache {
  private static instance: MemoryCache;
  private cache: Map<CacheKey, CacheItem<any>>;
  private cleanupInterval: number | null = null;
  
  // Default TTL values
  private readonly DEFAULT_TTL_SECONDS = 300; // 5 minutes
  private readonly MAX_TTL_SECONDS = 3600;    // 1 hour
  private readonly CLEANUP_INTERVAL_MS = 300000; // 5 minutes
  
  private constructor() {
    this.cache = new Map();
    this.startCleanupInterval();
  }
  
  /**
   * Get the singleton instance of MemoryCache
   */
  public static getInstance(): MemoryCache {
    if (!MemoryCache.instance) {
      MemoryCache.instance = new MemoryCache();
    }
    return MemoryCache.instance;
  }
  
  /**
   * Set a value in the cache with optional TTL
   * @param key - Cache key
   * @param data - Data to store
   * @param options - Cache options including TTL
   */
  public set<T>(key: CacheKey, data: T, options: CacheOptions = {}): void {
    const ttlSeconds = this.validateTtl(options.ttlSeconds);
    const expiry = Date.now() + (ttlSeconds * 1000);
    
    this.cache.set(key, {
      data,
      expiry
    });
  }
  
  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns The cached data or null if not found or expired
   */
  public get<T>(key: CacheKey): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    
    // Check if item exists and is not expired
    if (item && item.expiry > Date.now()) {
      return item.data;
    }
    
    // Remove expired item if it exists
    if (item) {
      this.cache.delete(key);
    }
    
    return null;
  }
  
  /**
   * Get data from cache or fetch it using the provided function
   * @param key - Cache key
   * @param fetchFn - Function to fetch the data if not in cache
   * @param options - Cache options including TTL
   * @returns Promise resolving to the data
   */
  public async getOrFetch<T>(
    key: CacheKey, 
    fetchFn: FetchFunction<T>,
    options: CacheOptions = {}
  ): Promise<T | null> {
    // Check cache first
    const cachedData = this.get<T>(key);
    if (cachedData !== null) {
      return cachedData;
    }
    
    try {
      // If not in cache, fetch the data
      const data = await fetchFn();
      
      // Cache the fetched data
      this.set<T>(key, data, options);
      
      return data;
    } catch (error) {
      console.error(`Error fetching data for cache key "${key}":`, error);
      return null;
    }
  }
  
  /**
   * Remove an item from the cache
   * @param key - Cache key
   */
  public remove(key: CacheKey): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear all items from the cache
   */
  public clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get the number of items in the cache
   */
  public size(): number {
    return this.cache.size;
  }
  
  /**
   * Check if an item exists in the cache and is not expired
   * @param key - Cache key
   */
  public has(key: CacheKey): boolean {
    const item = this.cache.get(key);
    return !!item && item.expiry > Date.now();
  }
  
  /**
   * Clean up expired cache items
   */
  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry <= now) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Start the automated cleanup interval
   */
  private startCleanupInterval(): void {
    if (this.cleanupInterval === null && typeof window !== 'undefined') {
      this.cleanupInterval = window.setInterval(() => {
        this.cleanup();
      }, this.CLEANUP_INTERVAL_MS);
    }
  }
  
  /**
   * Stop the automated cleanup interval
   */
  public stopCleanupInterval(): void {
    if (this.cleanupInterval !== null && typeof window !== 'undefined') {
      window.clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
  
  /**
   * Validate and normalize TTL value
   * @param ttl - TTL in seconds
   * @returns Normalized TTL value
   */
  private validateTtl(ttl?: number): number {
    if (ttl === undefined) {
      return this.DEFAULT_TTL_SECONDS;
    }
    
    // Ensure TTL is a positive number within allowed range
    return Math.min(
      Math.max(1, Math.floor(ttl)),
      this.MAX_TTL_SECONDS
    );
  }
}

// Export a singleton instance
export const memoryCache = MemoryCache.getInstance();
