
// Support the user property in mapDbReactionToReaction:
const mapDbReactionToReaction = (dbReaction: DbReaction, userData?: any): Reaction => {
  const reaction: Reaction = {
    id: dbReaction.id,
    type: dbReaction.type,
    userId: dbReaction.user_id,
    cardId: dbReaction.card_id,
    commentId: dbReaction.comment_id,
    collectionId: dbReaction.collection_id,
    createdAt: dbReaction.created_at
  };

  // Add user data if provided
  if (userData) {
    reaction.user = {
      id: userData.id,
      email: userData.email || '',
      displayName: userData.displayName || '',
      name: userData.name || '',
      avatarUrl: userData.avatarUrl,
      createdAt: '',  // Required by type but may not be available
      updatedAt: ''   // Required by type but may not be available
    };
  }

  return reaction;
};

// When handling reactions with user data:
const reactions: Reaction[] = data.map(item => {
  const reaction = mapDbReactionToReaction(item);
  if (item.profiles) {
    reaction.user = {
      id: item.profiles.id,
      email: item.profiles.email || '',
      displayName: item.profiles.displayName || '',
      name: item.profiles.full_name || '',
      username: item.profiles.username,
      avatarUrl: item.profiles.avatarUrl,
      createdAt: '',  // Required fields but not available from profiles
      updatedAt: ''   // Required fields but not available from profiles
    };
  }
  return reaction;
});
