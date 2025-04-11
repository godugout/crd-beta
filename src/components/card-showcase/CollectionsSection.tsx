
import React from 'react';
import { Collection } from '@/lib/types';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export interface CollectionsSectionProps {
  collections: Collection[];
  isLoading: boolean;
  handleViewCollection?: (collectionId: string) => void;
}

const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  collections,
  isLoading,
  handleViewCollection
}) => {
  const navigate = useNavigate();
  
  const handleCreateCollection = () => {
    navigate('/collections/create');
  };
  
  const onViewCollection = (collectionId: string) => {
    if (handleViewCollection) {
      handleViewCollection(collectionId);
    } else {
      // Standardize to using the plural form for consistency
      navigate(`/collections/${collectionId}`);
    }
  };
  
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">CRD Collections</h2>
        <Button onClick={handleCreateCollection}>Create Collection</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No CRD collections yet.</p>
          <Button onClick={handleCreateCollection}>Create Your First Collection</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.map(collection => (
            <div 
              key={collection.id} 
              className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onViewCollection(collection.id)}
            >
              <div className="h-40 bg-gray-100 overflow-hidden">
                {collection.coverImageUrl ? (
                  <img 
                    src={collection.coverImageUrl} 
                    alt={collection.name}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Cover Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium">{collection.name}</h3>
                {collection.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {collection.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CollectionsSection;
