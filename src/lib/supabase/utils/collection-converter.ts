
import { Collection, DbCollection } from '@/lib/types';

export const convertDbCollectionToApp = (dbCollection: DbCollection | null): Collection | null => {
  if (!dbCollection) return null;
  
  return {
    id: dbCollection.id,
    name: dbCollection.title,
    description: dbCollection.description || '',
    coverImageUrl: dbCollection.cover_image_url || '',
    userId: dbCollection.owner_id,
    teamId: dbCollection.team_id,
    visibility: dbCollection.visibility || 'public',
    allowComments: dbCollection.allow_comments,
    isPublic: dbCollection.visibility === 'public',
    designMetadata: dbCollection.design_metadata || {},
    cards: [],
    cardIds: [],
    createdAt: dbCollection.created_at,
    updatedAt: dbCollection.updated_at,
  };
};
