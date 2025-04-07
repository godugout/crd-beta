
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Collection } from '@/lib/types';

export interface CollectionsSectionProps {
  collections: Collection[];
}

const CollectionsSection: React.FC<CollectionsSectionProps> = ({ collections }) => {
  // Show only the first 3 collections
  const displayCollections = collections.slice(0, 3);
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Collections</h2>
          <Link 
            to="/collections" 
            className="text-cardshow-blue flex items-center hover:underline"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayCollections.map(collection => (
            <Link 
              to={`/collections/${collection.id}`} 
              key={collection.id}
              className="group"
            >
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-100 relative">
                  {collection.coverImage ? (
                    <img 
                      src={collection.coverImage} 
                      alt={collection.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-50"></div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-bold text-lg group-hover:text-cardshow-blue-light transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-gray-200">
                        {collection.cards?.length || 0} cards
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {collection.description || "No description provided for this collection."}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
