
import { supabase } from '@/lib/supabase';
import { Card, Collection, JsonObject, serializeMetadata } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

// Demo function to create a card (for development)
export const createCard = async (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> => {
  const newCard: Card = {
    id: uuidv4(),
    title: card.title,
    description: card.description || '',
    imageUrl: card.imageUrl,
    thumbnailUrl: card.thumbnailUrl || card.imageUrl,
    tags: card.tags || [],
    collectionId: card.collectionId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: card.userId || 'anonymous',
    teamId: card.teamId,
    isPublic: card.isPublic !== undefined ? card.isPublic : true,
    designMetadata: card.designMetadata || DEFAULT_DESIGN_METADATA,
    effects: card.effects || [], // Add required effects property
  };

  try {
    // In a production app, this would save to Supabase
    // const { data, error } = await supabase
    //   .from('cards')
    //   .insert({
    //     id: newCard.id,
    //     title: newCard.title,
    //     description: newCard.description,
    //     image_url: newCard.imageUrl,
    //     thumbnail_url: newCard.thumbnailUrl,
    //     tags: newCard.tags,
    //     collection_id: newCard.collectionId,
    //     user_id: newCard.userId,
    //     team_id: newCard.teamId,
    //     is_public: newCard.isPublic,
    //     design_metadata: serializeMetadata(newCard.designMetadata),
    //     created_at: newCard.createdAt,
    //     updated_at: newCard.updatedAt,
    //   })
    //   .select()
    //   .single();
    
    // if (error) throw error;
    // return mapDbCardToCard(data);
    
    // For development, just return the new card
    return newCard;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
};

// Helper function to map database structure to Card interface
const mapDbCardToCard = (dbCard: any): Card => {
  return {
    id: dbCard.id,
    title: dbCard.title,
    description: dbCard.description,
    imageUrl: dbCard.image_url,
    thumbnailUrl: dbCard.thumbnail_url,
    tags: dbCard.tags,
    collectionId: dbCard.collection_id,
    createdAt: dbCard.created_at,
    updatedAt: dbCard.updated_at,
    userId: dbCard.user_id,
    teamId: dbCard.team_id,
    isPublic: dbCard.is_public,
    designMetadata: dbCard.design_metadata || DEFAULT_DESIGN_METADATA,
    effects: dbCard.effects || [], // Add required effects property
  };
};

// Demo function to fetch cards (for development)
export const fetchCards = async (options?: {
  userId?: string;
  collectionId?: string;
  isPublic?: boolean;
  teamId?: string;
  limit?: number;
  cursor?: string;
}): Promise<Card[]> => {
  try {
    // In a production app, this would query Supabase
    // let query = supabase.from('cards').select('*');
    
    // if (options?.userId) {
    //   query = query.eq('user_id', options.userId);
    // }
    
    // if (options?.collectionId) {
    //   query = query.eq('collection_id', options.collectionId);
    // }
    
    // if (options?.isPublic !== undefined) {
    //   query = query.eq('is_public', options.isPublic);
    // }
    
    // if (options?.teamId) {
    //   query = query.eq('team_id', options.teamId);
    // }
    
    // if (options?.limit) {
    //   query = query.limit(options.limit);
    // }
    
    // const { data, error } = await query;
    
    // if (error) throw error;
    // return data.map(mapDbCardToCard);
    
    // For development, return mock data
    return [
      {
        id: '1',
        title: 'Sample Card 1',
        description: 'This is a sample card',
        imageUrl: '/sample-card-1.jpg',
        thumbnailUrl: '/sample-card-1-thumb.jpg',
        tags: ['sample', 'development'],
        collectionId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user1',
        teamId: 'team1',
        isPublic: true,
        designMetadata: DEFAULT_DESIGN_METADATA,
        effects: [], // Add required effects property
      },
      {
        id: '2',
        title: 'Sample Card 2',
        description: 'Another sample card',
        imageUrl: '/sample-card-2.jpg',
        thumbnailUrl: '/sample-card-2-thumb.jpg',
        tags: ['sample', 'premium'],
        collectionId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user1',
        teamId: 'team1',
        isPublic: true,
        designMetadata: DEFAULT_DESIGN_METADATA,
        effects: ['Holographic'], // Add required effects property
      },
    ];
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

// Function to convert database records to Card objects
export const convertDbRecordsToCards = (records: any[]): Card[] => {
  return records.map(record => ({
    id: record.id,
    title: record.title,
    description: record.description,
    imageUrl: record.imageUrl,
    thumbnailUrl: record.thumbnailUrl,
    tags: record.tags,
    collectionId: record.collectionId,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    userId: record.userId,
    teamId: record.teamId,
    isPublic: record.isPublic,
    designMetadata: record.designMetadata || DEFAULT_DESIGN_METADATA,
    effects: record.effects || [], // Add required effects property
  }));
};
