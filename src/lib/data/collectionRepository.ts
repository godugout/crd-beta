
// Update key parts of the file to handle teamId and team visibility

// When updating collections:
const updateCollectionData: any = {};
if (updates.name !== undefined) updateCollectionData.title = updates.name;
if (updates.description !== undefined) updateCollectionData.description = updates.description;
if (updates.coverImageUrl !== undefined) updateCollectionData.cover_image_url = updates.coverImageUrl;
if (updates.visibility !== undefined) {
  // Handle 'team' visibility which is valid in our code but needs mapping
  updateCollectionData.visibility = updates.visibility;
}
if (updates.allowComments !== undefined) updateCollectionData.allow_comments = updates.allowComments;
if (updates.designMetadata !== undefined) updateCollectionData.design_metadata = updates.designMetadata;
if (updates.teamId !== undefined) updateCollectionData.team_id = updates.teamId;

// When filtering collections, support teamId:
if (options.teamId) {
  query = query.eq('team_id', options.teamId);
}

// When creating collections:
const collectionData = {
  title: collection.name,
  description: collection.description || null,
  cover_image_url: collection.coverImageUrl || null,
  visibility: collection.visibility || 'private',
  allow_comments: collection.allowComments !== undefined ? collection.allowComments : true,
  owner_id: collection.userId,
  team_id: collection.teamId || null,
  design_metadata: collection.designMetadata || {}
};

// When mapping collections from DB:
const collection: Collection = {
  id: dbCollection.id,
  name: dbCollection.title,
  description: dbCollection.description || '',
  coverImageUrl: dbCollection.cover_image_url || undefined,
  visibility: dbCollection.visibility as 'public' | 'private' | 'unlisted' | 'team',
  allowComments: dbCollection.allow_comments || false,
  designMetadata: dbCollection.design_metadata,
  createdAt: dbCollection.created_at,
  updatedAt: dbCollection.updated_at,
  userId: dbCollection.owner_id,
  teamId: dbCollection.team_id
};
