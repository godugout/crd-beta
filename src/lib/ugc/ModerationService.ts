
import { UGCReport } from '@/lib/types/ugcTypes';

/**
 * Moderation Service for UGC content
 */
export const ModerationService = {
  /**
   * Report an asset for moderation
   */
  reportAsset: async (assetId: string, reason: string, details: string): Promise<{ success: boolean; reportId: string }> => {
    console.log('Reporting asset:', assetId, reason, details);
    return { success: true, reportId: `report-${Date.now()}` };
  },

  /**
   * Appeal a rejected asset
   */
  appealRejection: async (assetId: string, appealText: string) => {
    console.log('Appealing rejection:', assetId, appealText);
    return { success: true, appealId: `appeal-${Date.now()}` };
  },

  /**
   * Get moderation stats (admin only)
   */
  getModerationStats: async () => {
    return {
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      flaggedCount: 0,
      openReports: 0 // Added for ModerationDashboard
    };
  },

  /**
   * Get pending reports (admin only)
   */
  getPendingReports: async (limit = 20, offset = 0) => {
    // Return an array with map and length properties for ModerationDashboard
    const reports = [];
    const result = {
      reports,
      total: 0,
      map: function(callback: (report: any) => any) {
        return this.reports.map(callback);
      },
      length: 0
    };
    
    // Set length property for compatibility
    Object.defineProperty(result, 'length', {
      get: function() { return this.reports.length; }
    });
    
    return result;
  },

  /**
   * Moderate an asset (admin only)
   */
  moderateAsset: async (
    assetId: string,
    status: 'approved' | 'rejected' | 'flagged',
    moderatorId: string,
    reason?: string,
    notes?: string
  ) => {
    console.log('Moderating asset:', assetId, status, moderatorId);
    return { success: true };
  }
};

export default ModerationService;
