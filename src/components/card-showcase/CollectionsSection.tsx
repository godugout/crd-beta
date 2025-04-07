
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CollectionRecord {
  id: string;
  title: string;
  description: string | null;
  owner_id?: string;
  created_at: string;
  updated_at: string;
}

interface CollectionsSectionProps {
  isLoading: boolean;
  collections: CollectionRecord[];
  handleViewCollection: (collectionId: string) => void;
}

const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  isLoading,
  collections,
  handleViewCollection
}) => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Collections</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {collections.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 mb-4">No collections created yet</p>
                <Button onClick={() => navigate('/collections/new')}>Create Collection</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {collections.map((collection) => (
                  <div 
                    key={collection.id}
                    className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-[1.02] cursor-pointer"
                    onClick={() => handleViewCollection(collection.id)}
                  >
                    <h3 className="font-semibold text-xl mb-2">{collection.title}</h3>
                    <p className="text-gray-500 mb-4 line-clamp-2">{collection.description}</p>
                    <Button variant="outline" size="sm">View Collection</Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Button 
                variant="outline"
                onClick={() => navigate('/collections')}
              >
                Manage Collections
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CollectionsSection;
