
import { Collection } from '@/lib/types';

// Define DbCollection interface locally if it's not exported from types
interface DbCollection {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  cover_image_url?: string;
  owner_id?: string;
  team_id?: string;
  visibility?: string;
  allow_comments?: boolean;
  created_at: string;
  updated_at: string;
  design_metadata?: any;
}

export function dbToCollection(dbCollection: any): Collection {
  return {
    id: dbCollection.id,
    title: dbCollection.title || dbCollection.name || 'Untitled Collection', // Ensure title is set
    name: dbCollection.name || dbCollection.title || 'Untitled Collection',
    description: dbCollection.description || '',
    coverImageUrl: dbCollection.cover_image_url || '',
    userId: dbCollection.owner_id || dbCollection.user_id,
    teamId: dbCollection.team_id,
    visibility: dbCollection.visibility || 'public',
    allowComments: dbCollection.allow_comments ?? true,
    designMetadata: dbCollection.design_metadata || {},
    cards: dbCollection.cards || [],
    cardIds: dbCollection.card_ids || [],
    createdAt: dbCollection.created_at,
    updatedAt: dbCollection.updated_at,
    isPublic: dbCollection.visibility === 'public' || dbCollection.is_public === true
  };
}

export function collectionToDb(collection: Partial<Collection>): Partial<DbCollection> {
  return {
    id: collection.id,
    title: collection.title || collection.name,
    name: collection.name || collection.title,
    description: collection.description,
    cover_image_url: collection.coverImageUrl,
    owner_id: collection.userId,
    team_id: collection.teamId,
    visibility: collection.visibility,
    allow_comments: collection.allowComments,
    design_metadata: collection.designMetadata
  };
}
