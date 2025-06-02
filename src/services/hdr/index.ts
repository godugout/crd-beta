
import { HDRImageCacheService } from './hdrImageCache';

// Export singleton instance
export const hdrImageCache = new HDRImageCacheService();

// Preload images when the module loads (with error handling)
hdrImageCache.preloadAll().catch(error => {
  console.warn('HDRImageCache: Initial adaptive preload failed:', error);
});

// Clear old entries every 10 minutes
setInterval(() => {
  hdrImageCache.clearOldEntries();
}, 10 * 60 * 1000);

export default hdrImageCache;

// Re-export types for convenience
export type { CachedHDRImage, DeviceCapabilities, HDRResolution, EnvironmentType, HDRStats } from './types';
