
import { useState, useEffect } from 'react';
import { hdrImageCache } from '@/services/hdrImageCache';

interface HDRCacheStats {
  cachedImages: number;
  loadingImages: number;
  cacheUrls: string[];
}

export const useHDRCache = () => {
  const [stats, setStats] = useState<HDRCacheStats>({
    cachedImages: 0,
    loadingImages: 0,
    cacheUrls: []
  });
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(hdrImageCache.getStats());
    };

    // Update stats initially and then every 2 seconds
    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, []);

  const preloadAll = async () => {
    setIsPreloading(true);
    try {
      await hdrImageCache.preloadAll();
    } catch (error) {
      console.error('Failed to preload HDR images:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  const clearCache = () => {
    hdrImageCache.clearAll();
    setStats({ cachedImages: 0, loadingImages: 0, cacheUrls: [] });
  };

  const getUrlForEnvironment = (environmentType: string) => {
    return hdrImageCache.getUrlForEnvironment(environmentType);
  };

  return {
    stats,
    isPreloading,
    preloadAll,
    clearCache,
    getUrlForEnvironment
  };
};

export default useHDRCache;
