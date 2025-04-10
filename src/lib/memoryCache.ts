/**
 * MemoryCache - A simple in-memory cache with TTL support
 * 
 * Features:
 * - Cache data with configurable TTL (Time To Live)
 * - Auto cleanup of expired items
 * - Fetch-and-cache functionality for cache misses
 * - Typescript generics for type safety
 * - Offline fallback support using localforage
 */

import localforage from 'localforage';

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
  
  /**
   * Whether to persist data for offline use
   */
  persistOffline?: boolean;
}

export class MemoryCache {
  private static instance: MemoryCache;
  private cache: Map<CacheKey, CacheItem<any>>;
  private cleanupInterval: number | null = null;
  private offlineStore: ReturnType<typeof localforage.createInstance>;
  
  // Default TTL values
  private readonly DEFAULT_TTL_SECONDS = 300; // 5 minutes
  private readonly MAX_TTL_SECONDS = 3600;    // 1 hour
  private readonly CLEANUP_INTERVAL_MS = 300000; // 5 minutes
  
  private constructor() {
    this.cache = new Map();
    this.startCleanupInterval();
    
    // Initialize localForage for offline persistence
    this.offlineStore = localforage.createInstance({
      name: 'memoryCachePersistence',
      storeName: 'offlineCache'
    });
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
   * Set a value in the cache with optional TTL and offline persistence
   * @param key - Cache key
   * @param data - Data to store
   * @param options - Cache options including TTL and offline persistence
   */
  public async set<T>(key: CacheKey, data: T, options: CacheOptions = {}): Promise<void> {
    const ttlSeconds = this.validateTtl(options.ttlSeconds);
    const expiry = Date.now() + (ttlSeconds * 1000);
    
    const item: CacheItem<T> = {
      data,
      expiry
    };
    
    // Set in memory cache
    this.cache.set(key, item);
    
    // Persist offline if requested
    if (options.persistOffline) {
      try {
        await this.offlineStore.setItem(key, item);
      } catch (error) {
        console.error(`Error persisting cache item "${key}" offline:`, error);
      }
    }
  }
  
  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns The cached data or null if not found or expired
   */
  public async get<T>(key: CacheKey): Promise<T | null> {
    // Try memory cache first
    const memoryItem = this.cache.get(key) as CacheItem<T> | undefined;
    
    // If item exists and is not expired, return it
    if (memoryItem && memoryItem.expiry > Date.now()) {
      return memoryItem.data;
    }
    
    // Memory cache miss or expired, remove from memory cache
    if (memoryItem) {
      this.cache.delete(key);
    }
    
    // Try offline store
    try {
      const offlineItem = await this.offlineStore.getItem<CacheItem<T>>(key);
      
      if (offlineItem && offlineItem.expiry > Date.now()) {
        // Found in offline store and not expired, restore to memory cache
        this.cache.set(key, offlineItem);
        return offlineItem.data;
      } else if (offlineItem) {
        // Found in offline store but expired, remove it
        await this.offlineStore.removeItem(key);
      }
    } catch (error) {
      console.error(`Error retrieving offline cache item "${key}":`, error);
    }
    
    return null;
  }
  
  /**
   * Get data from cache or fetch it using the provided function
   * @param key - Cache key
   * @param fetchFn - Function to fetch the data if not in cache
   * @param options - Cache options including TTL and offline persistence
   * @returns Promise resolving to the data
   */
  public async getOrFetch<T>(
    key: CacheKey, 
    fetchFn: FetchFunction<T>,
    options: CacheOptions = {}
  ): Promise<T | null> {
    // Check cache first (including offline store)
    const cachedData = await this.get<T>(key);
    if (cachedData !== null) {
      return cachedData;
    }
    
    try {
      // If not in cache, fetch the data
      const data = await fetchFn();
      
      // Cache the fetched data
      await this.set<T>(key, data, options);
      
      return data;
    } catch (error) {
      console.error(`Error fetching data for cache key "${key}":`, error);
      return null;
    }
  }
  
  /**
   * Remove an item from both memory cache and offline store
   * @param key - Cache key
   */
  public async remove(key: CacheKey): Promise<void> {
    this.cache.delete(key);
    
    try {
      await this.offlineStore.removeItem(key);
    } catch (error) {
      console.error(`Error removing offline cache item "${key}":`, error);
    }
  }
  
  /**
   * Clear all items from memory cache and offline store
   */
  public async clear(): Promise<void> {
    this.cache.clear();
    
    try {
      await this.offlineStore.clear();
    } catch (error) {
      console.error('Error clearing offline cache:', error);
    }
  }
  
  /**
   * Get the number of items in the memory cache
   */
  public size(): number {
    return this.cache.size;
  }
  
  /**
   * Check if an item exists in the cache and is not expired
   * @param key - Cache key
   */
  public async has(key: CacheKey): Promise<boolean> {
    const memoryItem = this.cache.get(key);
    if (memoryItem && memoryItem.expiry > Date.now()) {
      return true;
    }
    
    // Memory cache miss, try offline store
    try {
      const offlineItem = await this.offlineStore.getItem<CacheItem<any>>(key);
      return !!offlineItem && offlineItem.expiry > Date.now();
    } catch (error) {
      console.error(`Error checking offline cache for item "${key}":`, error);
      return false;
    }
  }
  
  /**
   * Clean up expired cache items from both memory and offline store
   */
  private async cleanup(): Promise<void> {
    const now = Date.now();
    
    // Clean memory cache
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry <= now) {
        this.cache.delete(key);
      }
    }
    
    // Clean offline store
    try {
      const keys = await this.offlineStore.keys();
      
      for (const key of keys) {
        const item = await this.offlineStore.getItem<CacheItem<any>>(key);
        if (item && item.expiry <= now) {
          await this.offlineStore.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error cleaning up offline cache:', error);
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
