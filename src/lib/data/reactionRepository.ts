
import { supabase } from '@/integrations/supabase/client';
import { Reaction, User, UserRole } from '@/lib/types';

const reactionTable = 'reactions';

const mapReactionFromDb = (reaction: any): Reaction => {
  const user: User = {
    id: reaction.user_id,
    email: reaction.user.email,
    displayName: reaction.user.display_name,
    name: reaction.user.full_name, 
    avatarUrl: reaction.user.avatar_url,
    role: UserRole.USER, // Add default role
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    id: reaction.id,
    userId: reaction.user_id,
    cardId: reaction.card_id,
    collectionId: reaction.collection_id,
    commentId: reaction.comment_id,
    type: reaction.type,
    createdAt: reaction.created_at,
    user,
    targetType: reaction.target_type || 'card', // Add default targetType
    targetId: reaction.target_id || reaction.card_id || '' // Use card_id as default targetId if available
  };
};

const getAllByCardId = async (cardId: string): Promise<Reaction[]> => {
  const { data, error } = await supabase
    .from(reactionTable)
    .select(`
      id,
      user_id,
      card_id,
      type,
      created_at,
      users (
        id,
        email,
        display_name,
        full_name,
        username,
        avatar_url
      )
    `)
    .eq('card_id', cardId);
  
  if (error) {
    console.error('Error fetching reactions by card ID:', error);
    return [];
  }
  
  return data.map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    cardId: item.card_id,
    type: item.type,
    createdAt: item.created_at,
    targetType: 'card', // Add targetType
    targetId: item.card_id, // Use card_id as targetId
    user: item.users ? {
      id: item.users.id,
      email: item.users.email,
      displayName: item.users.display_name,
      name: item.users.full_name,
      username: item.users.username,
      avatarUrl: item.users.avatar_url,
      role: UserRole.USER, // Add default role
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } : undefined
  }));
};

const getAllByCollectionId = async (collectionId: string): Promise<Reaction[]> => {
  const { data, error } = await supabase
    .from(reactionTable)
    .select('*')
    .eq('collection_id', collectionId);
  
  if (error) {
    console.error('Error fetching reactions by collection ID:', error);
    return [];
  }
  
  return data.map(mapReactionFromDb);
};

const getAllByCommentId = async (commentId: string): Promise<Reaction[]> => {
  const { data, error } = await supabase
    .from(reactionTable)
    .select('*')
    .eq('comment_id', commentId);
  
  if (error) {
    console.error('Error fetching reactions by comment ID:', error);
    return [];
  }
  
  return data.map(mapReactionFromDb);
};

const add = async (userId: string, cardId?: string, collectionId?: string, commentId?: string, type?: string): Promise<Reaction | null> => {
  // Determine the target type and ID based on which ID is provided
  const targetType = cardId ? 'card' : (commentId ? 'comment' : 'collection');
  const targetId = cardId || commentId || collectionId || '';
  
  const { data, error } = await supabase
    .from(reactionTable)
    .insert([
      { 
        user_id: userId, 
        card_id: cardId, 
        collection_id: collectionId, 
        comment_id: commentId, 
        type: type,
        target_type: targetType,  // Add target_type field
        target_id: targetId       // Add target_id field
      }
    ])
    .select('*')
    .single();
  
  if (error) {
    console.error('Error adding reaction:', error);
    return null;
  }
  
  return mapReactionFromDb(data);
};

const remove = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from(reactionTable)
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error removing reaction:', error);
    return false;
  }
  
  return true;
};

export const reactionRepository = {
  getAllByCardId,
  getAllByCollectionId,
  getAllByCommentId,
  add,
  remove
};
