
import { UGCAsset, ModerationMetadata, MarketplaceMetadata, CreatorProfile } from '../types/ugcTypes';
import { ElementType, ElementCategory } from '../types/cardElements';
import { toastUtils } from '../utils/toast-utils';
import { supabase } from '../supabase';

/**
 * Manager for User-Generated Content operations
 */
export class UGCManager {
  /**
   * Upload a new UGC asset
   */
  static async uploadAsset(
    file: File,
    metadata: {
      title: string;
      description?: string;
      assetType: ElementType;
      category: ElementCategory;
      tags: string[];
      isPublic?: boolean;
      forSale?: boolean;
      price?: number;
    }
  ): Promise<UGCAsset | null> {
    try {
      // File validation
      const validationResult = await this.validateFile(file, metadata.assetType);
      if (!validationResult.valid) {
        toastUtils.error('Upload Failed', validationResult.error || 'File validation failed');
        return null;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toastUtils.error('Authentication Required', 'You must be logged in to upload assets');
        return null;
      }

      // Create unique file path
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const filePath = `ugc/${user.id}/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toastUtils.error('Upload Failed', 'Failed to upload file to storage');
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      // Create thumbnail
      const thumbnailUrl = await this.generateThumbnail(file);

      // Extract dimensions and file info
      const dimensions = await this.getImageDimensions(file);
      
      // Assess performance impact
      const performance = this.assessPerformance(file, metadata.assetType);

      // Initial moderation status
      const moderation: ModerationMetadata = {
        status: 'pending',
        aiConfidenceScore: 0.5, // Placeholder until AI moderation is implemented
      };

      // Marketplace settings if applicable
      const marketplace: MarketplaceMetadata | undefined = metadata.forSale ? {
        isForSale: true,
        price: metadata.price || 0,
        pricingModel: 'one-time',
        license: 'standard',
        salesCount: 0,
        rating: 0,
        ratingCount: 0,
      } : undefined;

      // Create asset in database
      const { data: asset, error: assetError } = await supabase
        .from('ugc_assets')
        .insert({
          title: metadata.title,
          description: metadata.description || '',
          asset_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          asset_type: metadata.assetType,
          category: metadata.category,
          tags: metadata.tags,
          creator_id: user.id,
          version: '1.0.0',
          moderation: moderation,
          marketplace: marketplace,
          is_public: metadata.isPublic || false,
          is_official: false,
          original_filename: file.name,
          mime_type: file.type,
          file_size: file.size,
          dimensions: dimensions,
          performance: performance,
        })
        .select()
        .single();

      if (assetError) {
        console.error('Error creating asset record:', assetError);
        // Clean up the uploaded file
        await supabase.storage.from('assets').remove([filePath]);
        toastUtils.error('Upload Failed', 'Failed to create asset record');
        return null;
      }

      // Transform to UGCAsset type
      const ugcAsset: UGCAsset = {
        id: asset.id,
        title: asset.title,
        description: asset.description,
        assetUrl: asset.asset_url,
        thumbnailUrl: asset.thumbnail_url,
        assetType: asset.asset_type as ElementType,
        category: asset.category as ElementCategory,
        tags: asset.tags || [],
        creatorId: asset.creator_id,
        createdAt: asset.created_at,
        updatedAt: asset.updated_at,
        version: asset.version,
        moderation: asset.moderation,
        marketplace: asset.marketplace,
        isPublic: asset.is_public,
        isOfficial: asset.is_official,
        originalFilename: asset.original_filename,
        mimeType: asset.mime_type,
        fileSize: asset.file_size,
        dimensions: asset.dimensions,
        performance: asset.performance,
      };

      toastUtils.success('Upload Complete', 'Your asset has been uploaded and is pending review');
      return ugcAsset;
    } catch (error) {
      console.error('Unexpected error in uploadAsset:', error);
      toastUtils.error('Upload Failed', 'An unexpected error occurred during upload');
      return null;
    }
  }

  /**
   * Validate a file before upload
   */
  private static async validateFile(
    file: File, 
    type: ElementType
  ): Promise<{ valid: boolean; error?: string }> {
    // File size limit - 5MB for most types, 10MB for frames and overlays
    const maxSize = type === 'frame' || type === 'overlay' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    
    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds the maximum allowed (${maxSize / (1024 * 1024)}MB)` };
    }

    // Allowed file types
    const allowedTypes: Record<ElementType, string[]> = {
      'sticker': ['image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      'logo': ['image/png', 'image/svg+xml', 'image/webp'],
      'frame': ['image/png', 'image/svg+xml'],
      'badge': ['image/png', 'image/svg+xml'],
      'overlay': ['image/png', 'image/webp', 'image/svg+xml'],
    };

    if (!allowedTypes[type].includes(file.type)) {
      return { valid: false, error: `Invalid file type for ${type}. Allowed types: ${allowedTypes[type].join(', ')}` };
    }

    // Additional validations based on element type
    switch (type) {
      case 'frame':
        if (file.type === 'image/png') {
          // For PNG frames, we should check for transparency, but this requires canvas
          // We'll implement a simplified check here
          if (!file.name.toLowerCase().includes('transparent')) {
            return { 
              valid: true, 
              warning: 'Frames should have transparency. If your PNG doesn\'t have transparency, it may not look correct.' 
            } as any;
          }
        }
        break;
        
      case 'overlay':
        // For overlays, we need to make sure they have transparency
        if (!['image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
          return { 
            valid: false, 
            error: 'Overlays must have transparency (PNG, SVG, or WebP)' 
          };
        }
        break;
    }

    return { valid: true };
  }

  /**
   * Generate a thumbnail for an asset
   */
  private static async generateThumbnail(file: File): Promise<string> {
    // For now, we'll just return the original URL, but in a real implementation
    // this would create a smaller thumbnail version
    return URL.createObjectURL(file);
  }

  /**
   * Get dimensions of an image file
   */
  private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = (err) => {
        reject(err);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Assess performance impact of the asset
   */
  private static assessPerformance(file: File, type: ElementType): PerformanceMetrics {
    // Simple performance assessment based on file size and type
    // In a real implementation, this would do more sophisticated analysis
    const fileSize = file.size;
    
    // Basic rules for render complexity
    let renderComplexity = 1;
    if (file.type === 'image/svg+xml') renderComplexity = 3;
    if (file.type === 'image/gif') renderComplexity = 5;
    if (fileSize > 1000000) renderComplexity += 2;
    
    // Cap render complexity at 10
    renderComplexity = Math.min(renderComplexity, 10);
    
    // Estimate memory usage based on file size (very simplified)
    const memoryUsage = fileSize / (1024 * 1024) * 1.5; // Roughly 1.5x file size
    
    // Recommended max uses depends on type and complexity
    let recommendedMaxUses = 10;
    if (renderComplexity > 7) recommendedMaxUses = 5;
    if (renderComplexity > 9) recommendedMaxUses = 2;
    if (type === 'overlay') recommendedMaxUses = Math.ceil(recommendedMaxUses / 2);
    
    return {
      fileSize,
      renderComplexity,
      memoryUsage,
      recommendedMaxUses
    };
  }

  /**
   * Get all public assets with optional filtering
   */
  static async getPublicAssets(options: {
    assetType?: ElementType;
    category?: ElementCategory;
    tags?: string[];
    creatorId?: string;
    featured?: boolean;
    sortBy?: 'latest' | 'popular' | 'rating';
    limit?: number;
    offset?: number;
  } = {}): Promise<UGCAsset[]> {
    try {
      let query = supabase
        .from('ugc_assets')
        .select('*')
        .eq('is_public', true)
        .eq('moderation->status', 'approved');
      
      // Apply filters
      if (options.assetType) {
        query = query.eq('asset_type', options.assetType);
      }
      
      if (options.category) {
        query = query.eq('category', options.category);
      }
      
      if (options.tags && options.tags.length > 0) {
        query = query.overlaps('tags', options.tags);
      }
      
      if (options.creatorId) {
        query = query.eq('creator_id', options.creatorId);
      }
      
      if (options.featured) {
        query = query.eq('marketplace->featured', true);
      }
      
      // Apply sorting
      if (options.sortBy) {
        switch (options.sortBy) {
          case 'latest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'popular':
            query = query.order('marketplace->sales_count', { ascending: false });
            break;
          case 'rating':
            query = query.order('marketplace->rating', { ascending: false });
            break;
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching assets:', error);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        assetUrl: item.asset_url,
        thumbnailUrl: item.thumbnail_url,
        assetType: item.asset_type as ElementType,
        category: item.category as ElementCategory,
        tags: item.tags || [],
        creatorId: item.creator_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        version: item.version,
        moderation: item.moderation,
        marketplace: item.marketplace,
        isPublic: item.is_public,
        isOfficial: item.is_official,
        originalFilename: item.original_filename,
        mimeType: item.mime_type,
        fileSize: item.file_size,
        dimensions: item.dimensions,
        performance: item.performance,
      }));
    } catch (error) {
      console.error('Unexpected error in getPublicAssets:', error);
      return [];
    }
  }

  /**
   * Get creator profile
   */
  static async getCreatorProfile(userId: string): Promise<CreatorProfile | null> {
    try {
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching creator profile:', error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      return {
        id: data.id,
        userId: data.user_id,
        displayName: data.display_name,
        bio: data.bio,
        avatarUrl: data.avatar_url,
        website: data.website,
        socialLinks: data.social_links,
        featured: data.featured,
        verificationStatus: data.verification_status,
        joinedAt: data.joined_at,
        assetCount: data.asset_count,
        totalSales: data.total_sales,
        rating: data.rating,
        ratingCount: data.rating_count,
        earnings: data.earnings,
        payoutInfo: data.payout_info,
      };
    } catch (error) {
      console.error('Unexpected error in getCreatorProfile:', error);
      return null;
    }
  }

  /**
   * Create/update creator profile
   */
  static async updateCreatorProfile(profile: Partial<CreatorProfile> & { userId: string }): Promise<CreatorProfile | null> {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', profile.userId)
        .single();
      
      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('creator_profiles')
          .update({
            display_name: profile.displayName,
            bio: profile.bio,
            avatar_url: profile.avatarUrl,
            website: profile.website,
            social_links: profile.socialLinks,
          })
          .eq('id', existingProfile.id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating creator profile:', error);
          return null;
        }
        
        return this.getCreatorProfile(profile.userId);
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('creator_profiles')
          .insert({
            user_id: profile.userId,
            display_name: profile.displayName || 'Anonymous Creator',
            bio: profile.bio,
            avatar_url: profile.avatarUrl,
            website: profile.website,
            social_links: profile.socialLinks,
            verification_status: 'unverified',
            asset_count: 0,
            total_sales: 0,
            rating: 0,
            rating_count: 0,
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error creating creator profile:', error);
          return null;
        }
        
        return this.getCreatorProfile(profile.userId);
      }
    } catch (error) {
      console.error('Unexpected error in updateCreatorProfile:', error);
      return null;
    }
  }

  /**
   * Report an asset for moderation
   */
  static async reportAsset(
    assetId: string, 
    reason: string, 
    details: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toastUtils.error('Authentication Required', 'You must be logged in to report content');
        return false;
      }

      const { error } = await supabase
        .from('ugc_reports')
        .insert({
          asset_id: assetId,
          reporter_id: user.id,
          reason: reason,
          details: details,
          status: 'open'
        });
      
      if (error) {
        console.error('Error submitting report:', error);
        toastUtils.error('Report Failed', 'Failed to submit the report');
        return false;
      }
      
      toastUtils.success('Report Submitted', 'Thank you for your report. It will be reviewed by our team.');
      return true;
    } catch (error) {
      console.error('Unexpected error in reportAsset:', error);
      toastUtils.error('Report Failed', 'An unexpected error occurred');
      return false;
    }
  }
}
