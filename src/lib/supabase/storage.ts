
import { supabase } from './client';

// Media/Storage operations
export const storageOperations = {
  uploadImage: async (file: File, path: string): Promise<{ data: { path: string; url: string } | null; error: any }> => {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('card-images')
      .upload(filePath, file);
      
    if (data) {
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('card-images')
        .getPublicUrl(data.path);
        
      return { 
        data: { 
          path: data.path,
          url: publicUrl 
        }, 
        error 
      };
    }
    
    return { data: null, error };
  },
  
  deleteImage: async (path: string): Promise<{ error: any }> => {
    const { error } = await supabase.storage
      .from('card-images')
      .remove([path]);
      
    return { error };
  }
};
