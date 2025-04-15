
import localforage from 'localforage';

// Configure cache instance
const cache = localforage.createInstance({
  name: 'cardshow',
  storeName: 'data-cache'
});

// Default cache configuration
const DEFAULT_CACHE_OPTIONS = {
  expirationTime: 1000 * 60 * 60, // 1 hour in milliseconds
  maxEntries: 100
};

export interface CacheOptions {
  expirationTime?: number;
  maxEntries?: number;
  ignoreCache?: boolean; // Use for force fetching fresh data
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * DataCache - Provides caching functionality for API responses and other data
 */
export class DataCache {
  // Cache initialization status
  private static initialized = false;
  
  // Cache configuration
  private static options = DEFAULT_CACHE_OPTIONS;
  
  /**
   * Initialize the cache with options
   */
  static async init(options: CacheOptions = {}): Promise<void> {
    if (this.initialized) return;
    
    this.options = {
      ...DEFAULT_CACHE_OPTIONS,
      ...options
    };
    
    try {
      // Clean expired entries on init
      await this.cleanExpiredEntries();
      this.initialized = true;
      console.log('DataCache initialized');
    } catch (error) {
      console.error('Error initializing cache:', error);
    }
  }
  
  /**
   * Set a value in the cache
   */
  static async set<T>(key: string, data: T): Promise<void> {
    try {
      await this.ensureInitialized();
      
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now()
      };
      
      await cache.setItem(key, entry);
      
      // Check if we need to maintain max entries limit
      await this.enforceMaxEntries();
    } catch (error) {
      console.error('Error setting cache item:', error);
    }
  }
  
  /**
   * Get a value from the cache
   */
  static async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      await this.ensureInitialized();
      
      // Skip cache if requested
      if (options.ignoreCache) {
        return null;
      }
      
      const entry = await cache.getItem<CacheEntry<T>>(key);
      
      // Check if entry exists and is not expired
      if (entry) {
        const expirationTime = options.expirationTime || this.options.expirationTime;
        const now = Date.now();
        
        if ((now - entry.timestamp) <= expirationTime) {
          return entry.data;
        }
        
        // Entry is expired, remove it
        await cache.removeItem(key);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cache item:', error);
      return null;
    }
  }
  
  /**
   * Delete a value from the cache
   */
  static async delete(key: string): Promise<void> {
    try {
      await this.ensureInitialized();
      await cache.removeItem(key);
    } catch (error) {
      console.error('Error deleting cache item:', error);
    }
  }
  
  /**
   * Clear all values from the cache
   */
  static async clear(): Promise<void> {
    try {
      await this.ensureInitialized();
      await cache.clear();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
  
  /**
   * Get all keys in the cache
   */
  static async keys(): Promise<string[]> {
    try {
      await this.ensureInitialized();
      return await cache.keys();
    } catch (error) {
      console.error('Error getting cache keys:', error);
      return [];
    }
  }
  
  /**
   * Clean expired entries from the cache
   */
  static async cleanExpiredEntries(): Promise<void> {
    try {
      const keys = await cache.keys();
      const now = Date.now();
      const expirationTime = this.options.expirationTime;
      
      for (const key of keys) {
        const entry = await cache.getItem<CacheEntry<any>>(key);
        if (entry && (now - entry.timestamp > expirationTime)) {
          await cache.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error cleaning expired cache entries:', error);
    }
  }
  
  /**
   * Ensure we don't exceed the maximum number of entries
   */
  private static async enforceMaxEntries(): Promise<void> {
    try {
      const keys = await cache.keys();
      
      if (keys.length <= this.options.maxEntries) {
        return;
      }
      
      // Get all entries with timestamps
      const entries = await Promise.all(
        keys.map(async key => {
          const entry = await cache.getItem<CacheEntry<any>>(key);
          return { key, timestamp: entry?.timestamp || 0 };
        })
      );
      
      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a.timestamp - b.timestamp);
      
      // Remove oldest entries until we're under the limit
      const entriesToRemove = entries.slice(0, entries.length - this.options.maxEntries);
      
      for (const entry of entriesToRemove) {
        await cache.removeItem(entry.key);
      }
    } catch (error) {
      console.error('Error enforcing max cache entries:', error);
    }
  }
  
  /**
   * Make sure the cache is initialized
   */
  private static async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }
}

export default DataCache;
