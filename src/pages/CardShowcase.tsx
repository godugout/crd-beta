
// Update the CardShowcase component with the right type handling
interface CollectionRecord {
  id: string;
  title?: string; // Make this optional to match with DB structure
  name?: string; // Make this optional as it's derived from title
  description?: string;
  cover_image_url?: string;
  visibility?: 'public' | 'private' | 'team';
  allow_comments?: boolean;
  design_metadata?: {
    wrapperColor?: string;
    wrapperPattern?: string;
    packType?: 'memory-pack' | 'standard';
  };
}

// Then in the component where collections are transformed:
const typedCollections = collectionsData as unknown as CollectionRecord[];
        
const formattedCollections: Collection[] = typedCollections.map(collection => ({
  id: collection.id,
  name: collection.title || '', // Use title instead of name
  description: collection.description || '',
  coverImageUrl: collection.cover_image_url || '',
  visibility: collection.visibility || 'public',
  allowComments: collection.allow_comments !== undefined ? collection.allow_comments : true,
  designMetadata: collection.design_metadata || {}
}));
