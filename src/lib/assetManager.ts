
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
        team_id: cardInfo.teamId || null,
        tags: cardInfo.tags || [],
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
    
    const { error: linkError } = await supabase
      .from('asset_links')
      .insert(assetLinks);
    
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
    // Get asset links for this bundle
    const { data: links, error: linkError } = await supabase
      .from('asset_links')
      .select('*')
      .eq('bundle_id', bundleId)
      .order('display_order', { ascending: true });
    
    if (linkError) throw linkError;
    if (!links || links.length === 0) {
      throw new Error('Asset bundle not found');
    }
    
    // Get the card information
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('*')
      .eq('id', links[0].card_id)
      .single();
    
    if (cardError) throw cardError;
    
    // Get all media items
    const mediaIds = links.map(link => link.media_id);
    const { data: media, error: mediaError } = await supabase
      .from('digital_assets')
      .select('*')
      .in('id', mediaIds);
    
    if (mediaError) throw mediaError;
    
    // Sort media based on the original display order
    const sortedMedia = media?.sort((a, b) => {
      const aLink = links.find(link => link.media_id === a.id);
      const bLink = links.find(link => link.media_id === b.id);
      return (aLink?.display_order || 0) - (bLink?.display_order || 0);
    });
    
    return {
      bundle: { id: bundleId },
      card,
      media: sortedMedia || []
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
      // Get current links to determine card ID
      const { data: currentLinks, error: linkError } = await supabase
        .from('asset_links')
        .select('card_id, user_id')
        .eq('bundle_id', bundleId)
        .limit(1);
      
      if (linkError) throw linkError;
      if (!currentLinks || currentLinks.length === 0) {
        throw new Error('Asset bundle not found');
      }
      
      const cardId = currentLinks[0].card_id;
      const userId = currentLinks[0].user_id;
      
      // Delete existing links
      await supabase
        .from('asset_links')
        .delete()
        .eq('bundle_id', bundleId);
      
      // Create new links with updated order
      const newLinks = mediaIds.map((mediaId, index) => ({
        bundle_id: bundleId,
        media_id: mediaId,
        card_id: cardId,
        user_id: userId,
        display_order: index
      }));
      
      const { error: insertError } = await supabase
        .from('asset_links')
        .insert(newLinks);
      
      if (insertError) throw insertError;
    }
    
    if (cardUpdates) {
      // Get the card ID
      const { data: links, error: linkError } = await supabase
        .from('asset_links')
        .select('card_id')
        .eq('bundle_id', bundleId)
        .limit(1);
      
      if (linkError) throw linkError;
      if (!links || links.length === 0) {
        throw new Error('Asset bundle not found');
      }
      
      const cardId = links[0].card_id;
      
      // Update the card
      const { error: updateError } = await supabase
        .from('cards')
        .update(cardUpdates)
        .eq('id', cardId);
      
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
    const { error } = await supabase
      .from('asset_links')
      .delete()
      .eq('bundle_id', bundleId);
    
    if (error) throw error;
    
    toast.success('Asset bundle deleted successfully');
  } catch (error: any) {
    console.error('Error deleting asset bundle:', error);
    toast.error('Failed to delete asset bundle');
    throw error;
  }
};
