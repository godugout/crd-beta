
interface StorageService {
  uploadFile: (file: File, path: string) => Promise<{ url: string; path: string; }>;
  deleteFile: (path: string) => Promise<boolean>;
  getPublicUrl: (path: string) => string;
}

export const StorageService: StorageService = {
  uploadFile: async (file: File, path: string) => {
    // Mock implementation for now
    const url = URL.createObjectURL(file);
    return { url, path };
  },
  
  deleteFile: async (path: string) => {
    // Mock implementation
    return true;
  },
  
  getPublicUrl: (path: string) => {
    // Mock implementation
    return `/uploads/${path}`;
  }
};
