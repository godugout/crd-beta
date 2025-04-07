
import React from 'react';
import { Collection } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CollectionsSectionProps {
  collections: Collection[];
}

const CollectionsSection: React.FC<CollectionsSectionProps> = ({ collections }) => {
  if (!collections || collections.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Collections</h2>
            <Link to="/collections/new">
              <Button>Create Collection</Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You don't have any collections yet</p>
            <Link to="/collections/new">
              <Button>Create Your First Collection</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Your Collections</h2>
          <Link to="/collections">
            <Button variant="outline" className="flex items-center gap-1">
              View All <ArrowRightIcon size={16} />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.slice(0, 3).map((collection) => (
            <Link 
              key={collection.id} 
              to={`/collections/${collection.id}`} 
              className="block group"
            >
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 h-full">
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  {collection.coverImageUrl ? (
                    <img 
                      src={collection.coverImageUrl} 
                      alt={collection.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-300 text-xl">No Cover Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">{collection.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {collection.description || 'No description'}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {collection.cards?.length || 0} cards
                    </span>
                    <Button variant="link" className="p-0 h-auto text-cardshow-blue">
                      View Collection
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {collections.length > 3 && (
          <div className="mt-10 text-center">
            <Link to="/collections">
              <Button>View All Collections</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionsSection;
