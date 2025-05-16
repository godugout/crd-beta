
import { UGCModerationStatus, UGCModerationReason, UGCReport } from '../types/ugcTypes';
import { supabase } from '../supabase';

/**
 * Service for handling content moderation
 */
export class ModerationService {
  /**
   * Check content with AI moderation
   * This is a placeholder implementation that would be replaced with a real AI service
   */
  static async checkContentWithAI(imageUrl: string, text?: string): Promise<{
    status: UGCModerationStatus;
    confidence: number;
    reason?: UGCModerationReason;
  }> {
    // In a real implementation, this would call an AI service
    // For demo purposes, we'll simulate a random response
    
    // Generate a random score (0-1)
    const score = Math.random();
    
    if (score > 0.95) {
      return {
        status: 'rejected',
        confidence: score,
        reason: 'inappropriate'
      };
    } else if (score > 0.85) {
      return {
        status: 'flagged',
        confidence: score,
        reason: 'quality'
      };
    } else {
      return {
        status: 'approved',
        confidence: score
      };
    }
  }

  /**
   * Process pending moderation items
   * This would typically run as a background job
   */
  static async processPendingModeration(): Promise<number> {
    try {
      // Get pending moderation items
      const { data, error } = await supabase
        .from('ugc_assets')
        .select('id, asset_url, title, description')
        .eq('moderation->status', 'pending')
        .limit(10); // Process in batches
      
      if (error || !data) {
        console.error('Error fetching pending moderation items:', error);
        return 0;
      }
      
      let processedCount = 0;
      
      // Process each item
      for (const item of data) {
        // Check content with AI
        const aiResult = await this.checkContentWithAI(
          item.asset_url, 
          `${item.title} ${item.description || ''}`
        );
        
        // Update moderation status
        const { error: updateError } = await supabase
          .from('ugc_assets')
          .update({
            moderation: {
              status: aiResult.status,
              aiConfidenceScore: aiResult.confidence,
              reason: aiResult.reason,
              reviewDate: new Date().toISOString(),
              appealAllowed: aiResult.status === 'rejected'
            }
          })
          .eq('id', item.id);
          
        if (!updateError) {
          processedCount++;
        }
      }
      
      return processedCount;
    } catch (error) {
      console.error('Error in processPendingModeration:', error);
      return 0;
    }
  }

  /**
   * Get pending reports for admin moderation
   */
  static async getPendingReports(limit = 20, offset = 0): Promise<UGCReport[]> {
    try {
      const { data, error } = await supabase
        .from('ugc_reports')
        .select(`
          *,
          reporter:reporter_id(id, email),
          asset:asset_id(id, title, asset_url, thumbnail_url)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
        
      if (error) {
        console.error('Error fetching pending reports:', error);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        assetId: item.asset_id,
        reporterId: item.reporter_id,
        reason: item.reason,
        details: item.details,
        status: item.status,
        createdAt: item.created_at,
        resolvedAt: item.resolved_at,
        reporter: item.reporter,
        asset: item.asset
      }));
    } catch (error) {
      console.error('Error in getPendingReports:', error);
      return [];
    }
  }
  
  /**
   * Get moderation stats for dashboard
   */
  static async getModerationStats(): Promise<{
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    flaggedCount: number;
    appealedCount: number;
    totalReports: number;
    openReports: number;
  }> {
    try {
      // Get counts of each moderation status
      const pendingPromise = supabase
        .from('ugc_assets')
        .select('id', { count: 'exact', head: true })
        .eq('moderation->status', 'pending');
        
      const approvedPromise = supabase
        .from('ugc_assets')
        .select('id', { count: 'exact', head: true })
        .eq('moderation->status', 'approved');
        
      const rejectedPromise = supabase
        .from('ugc_assets')
        .select('id', { count: 'exact', head: true })
        .eq('moderation->status', 'rejected');
        
      const flaggedPromise = supabase
        .from('ugc_assets')
        .select('id', { count: 'exact', head: true })
        .eq('moderation->status', 'flagged');
        
      const appealedPromise = supabase
        .from('ugc_assets')
        .select('id', { count: 'exact', head: true })
        .eq('moderation->status', 'appealed');
        
      const totalReportsPromise = supabase
        .from('ugc_reports')
        .select('id', { count: 'exact', head: true });
        
      const openReportsPromise = supabase
        .from('ugc_reports')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'open');
      
      // Run all queries in parallel
      const [
        pendingResult,
        approvedResult,
        rejectedResult,
        flaggedResult,
        appealedResult,
        totalReportsResult,
        openReportsResult
      ] = await Promise.all([
        pendingPromise,
        approvedPromise,
        rejectedPromise,
        flaggedPromise,
        appealedPromise,
        totalReportsPromise,
        openReportsPromise
      ]);
      
      return {
        pendingCount: pendingResult.count || 0,
        approvedCount: approvedResult.count || 0,
        rejectedCount: rejectedResult.count || 0,
        flaggedCount: flaggedResult.count || 0,
        appealedCount: appealedResult.count || 0,
        totalReports: totalReportsResult.count || 0,
        openReports: openReportsResult.count || 0
      };
    } catch (error) {
      console.error('Error in getModerationStats:', error);
      return {
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        flaggedCount: 0,
        appealedCount: 0,
        totalReports: 0,
        openReports: 0
      };
    }
  }
  
  /**
   * Moderate an asset (admin action)
   */
  static async moderateAsset(
    assetId: string, 
    status: UGCModerationStatus,
    moderatorId: string,
    reason?: UGCModerationReason,
    notes?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ugc_assets')
        .update({
          moderation: {
            status,
            reason,
            notes,
            moderator: moderatorId,
            reviewDate: new Date().toISOString(),
            appealAllowed: status === 'rejected',
          }
        })
        .eq('id', assetId);
      
      if (error) {
        console.error('Error moderating asset:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in moderateAsset:', error);
      return false;
    }
  }
  
  /**
   * Appeal a rejected asset
   */
  static async appealRejection(assetId: string, appealText: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return false;
      }
      
      // Check if asset belongs to user and is rejected
      const { data: asset, error: assetError } = await supabase
        .from('ugc_assets')
        .select('creator_id, moderation')
        .eq('id', assetId)
        .single();
      
      if (assetError || !asset) {
        console.error('Error fetching asset:', assetError);
        return false;
      }
      
      if (asset.creator_id !== user.id) {
        console.error('User does not own this asset');
        return false;
      }
      
      if (asset.moderation?.status !== 'rejected') {
        console.error('Asset is not rejected, cannot appeal');
        return false;
      }
      
      if (asset.moderation?.appealAllowed === false) {
        console.error('Appeals are not allowed for this asset');
        return false;
      }
      
      // Submit appeal
      const { error: updateError } = await supabase
        .from('ugc_assets')
        .update({
          moderation: {
            ...asset.moderation,
            status: 'appealed',
            appealText,
            appealDate: new Date().toISOString()
          }
        })
        .eq('id', assetId);
      
      if (updateError) {
        console.error('Error submitting appeal:', updateError);
        return false;
      }
      
      // Create appeal record
      const { error: appealError } = await supabase
        .from('ugc_appeals')
        .insert({
          asset_id: assetId,
          user_id: user.id,
          appeal_text: appealText,
          original_reason: asset.moderation?.reason,
          status: 'pending'
        });
        
      if (appealError) {
        console.error('Error creating appeal record:', appealError);
        // Continue anyway since the status is already updated
      }
      
      return true;
    } catch (error) {
      console.error('Error in appealRejection:', error);
      return false;
    }
  }
}
