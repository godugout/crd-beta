
/**
 * Storage Service stub for Cardshow (CRD) application
 */

/**
 * Storage service for accessing asset storage
 */
export const storageService = {
  /**
   * Upload a file to storage
   */
  uploadFile: async (file: File, path: string): Promise<{ url: string; path: string }> => {
    console.log('Mock uploadFile:', file.name, path);
    return {
      url: URL.createObjectURL(file),
      path: `${path}/${file.name}`
    };
  },
  
  /**
   * Delete a file from storage
   */
  deleteFile: async (path: string): Promise<boolean> => {
    console.log('Mock deleteFile:', path);
    return true;
  },
  
  /**
   * Get a temporary public URL for a file
   */
  getPublicUrl: (path: string): string => {
    return `https://placehold.co/600x400?text=${encodeURIComponent(path)}`;
  }
};

// Alias for backward compatibility
export const StorageService = storageService;

export default storageService;
