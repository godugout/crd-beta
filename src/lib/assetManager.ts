
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

/**
 * Type definitions for asset management
 */
export interface CardInfo {
  title: string;
  description?: string;
  playerId?: string;
  teamId?: string;
  gameId?: string;
  year?: number;
  tags?: string[];
  isCustom: boolean;
  templateId?: string;
}

export interface AssetBundle {
  id: string;
  mediaIds: string[];
  cardId: string;
}

/**
 * Creates an asset bundle linking multiple media items with card information
 */
export const createAssetBundle = async (
  mediaIds: string[], 
  cardInfo: CardInfo,
  userId: string
): Promise<AssetBundle> => {
  const bundleId = uuidv4();
  
  try {
    // First, create the card record
    const { data: cardData, error: cardError } = await supabase
      .from('cards')
      .insert({
        title: cardInfo.title,
        description: cardInfo.description || null,
        user_id: userId,
        creator_id: userId, // Required field from the schema
        team_id: cardInfo.teamId || null,
        tags: cardInfo.tags || [],
        rarity: 'common', // Required field from the schema
        edition_size: 1, // Required field from the schema
        design_metadata: {
          player_id: cardInfo.playerId || null,
          game_id: cardInfo.gameId || null,
          year: cardInfo.year || null,
          is_custom: cardInfo.isCustom,
          template_id: cardInfo.templateId || null,
        }
      })
      .select()
      .single();
    
    if (cardError) throw cardError;
    
    // Create asset links for each media item
    const assetLinks = mediaIds.map(mediaId => ({
      bundle_id: bundleId,
      media_id: mediaId,
      card_id: cardData.id,
      user_id: userId,
      display_order: mediaIds.indexOf(mediaId),
    }));
    
    // Since asset_links table doesn't exist yet, we'll use asset_usages instead
    // This could be a temporary solution until a proper DB migration is done
    const { error: linkError } = await supabase
      .from('asset_usages')
      .insert(assetLinks.map(link => ({
        asset_id: link.media_id,
        reference_id: link.card_id,
        usage_type: 'card_asset'
      })));
    
    if (linkError) throw linkError;
    
    return {
      id: bundleId,
      mediaIds,
      cardId: cardData.id
    };
  } catch (error: any) {
    console.error('Error creating asset bundle:', error);
    toast.error('Failed to create asset bundle');
    throw error;
  }
};

/**
 * Retrieves a complete asset bundle with all media and card info
 */
export const getAssetBundle = async (
  bundleId: string
): Promise<{
  bundle: { id: string };
  card: any;
  media: any[];
}> => {
  try {
    // Since we're using asset_usages instead of asset_links,
    // we need to adapt our query
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('*')
      .eq('id', bundleId)
      .single();
    
    if (cardError) throw cardError;
    
    // Get all media items linked to this card
    const { data: assetUsages, error: usageError } = await supabase
      .from('asset_usages')
      .select('*')
      .eq('reference_id', card.id)
      .eq('usage_type', 'card_asset');
    
    if (usageError) throw usageError;
    
    if (!assetUsages || assetUsages.length === 0) {
      return {
        bundle: { id: bundleId },
        card,
        media: []
      };
    }
    
    // Get media items
    const assetIds = assetUsages.map(usage => usage.asset_id);
    const { data: media, error: mediaError } = await supabase
      .from('digital_assets')
      .select('*')
      .in('id', assetIds);
    
    if (mediaError) throw mediaError;
    
    return {
      bundle: { id: bundleId },
      card,
      media: media || []
    };
  } catch (error: any) {
    console.error('Error retrieving asset bundle:', error);
    toast.error('Failed to retrieve asset bundle');
    throw error;
  }
};

/**
 * Updates asset bundle order or contents
 */
export const updateAssetBundle = async (
  bundleId: string,
  updates: {
    mediaIds?: string[];
    cardUpdates?: Record<string, any>;
  }
): Promise<void> => {
  const { mediaIds, cardUpdates } = updates;
  
  try {
    if (mediaIds) {
      // First, get the card ID
      const { data: card, error: cardError } = await supabase
        .from('cards')
        .select('id')
        .eq('id', bundleId)
        .single();
      
      if (cardError) throw cardError;
      
      // Delete existing links
      await supabase
        .from('asset_usages')
        .delete()
        .eq('reference_id', card.id)
        .eq('usage_type', 'card_asset');
      
      // Create new links
      const newLinks = mediaIds.map((mediaId) => ({
        asset_id: mediaId,
        reference_id: card.id,
        usage_type: 'card_asset'
      }));
      
      const { error: insertError } = await supabase
        .from('asset_usages')
        .insert(newLinks);
      
      if (insertError) throw insertError;
    }
    
    if (cardUpdates) {
      // Update the card directly using its ID as bundleId
      const { error: updateError } = await supabase
        .from('cards')
        .update(cardUpdates)
        .eq('id', bundleId);
      
      if (updateError) throw updateError;
    }
  } catch (error: any) {
    console.error('Error updating asset bundle:', error);
    toast.error('Failed to update asset bundle');
    throw error;
  }
};

/**
 * Deletes an asset bundle
 */
export const deleteAssetBundle = async (
  bundleId: string
): Promise<void> => {
  try {
    // Delete all asset usages for this card
    const { error: usageError } = await supabase
      .from('asset_usages')
      .delete()
      .eq('reference_id', bundleId)
      .eq('usage_type', 'card_asset');
    
    if (usageError) throw usageError;
    
    // Delete the card itself
    const { error: cardError } = await supabase
      .from('cards')
      .delete()
      .eq('id', bundleId);
    
    if (cardError) throw cardError;
    
    toast.success('Asset bundle deleted successfully');
  } catch (error: any) {
    console.error('Error deleting asset bundle:', error);
    toast.error('Failed to delete asset bundle');
    throw error;
  }
};
