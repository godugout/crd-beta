
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, ChevronsUpDown, Star, Check, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

// Example collection data - in a real app, this would come from the backend
const COLLECTIONS = [
  {
    id: 'collection-1',
    title: 'Card Remixes',
    coverImage: '/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png',
    owner: '@jaybhai',
    itemCount: 28,
    items: [
      { id: 'item-1', imageUrl: '/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png' },
      { id: 'item-2', imageUrl: '/lovable-uploads/f07b9e90-98ec-4e0c-bca4-71acd9ae9924.png' },
      { id: 'item-3', imageUrl: '/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png' }
    ]
  },
  {
    id: 'collection-2',
    title: 'Hip Hop Card Art',
    coverImage: '/lovable-uploads/f07b9e90-98ec-4e0c-bca4-71acd9ae9924.png',
    owner: '@nastradamus',
    itemCount: 9,
    items: [
      { id: 'item-4', imageUrl: '/lovable-uploads/f07b9e90-98ec-4e0c-bca4-71acd9ae9924.png' },
      { id: 'item-5', imageUrl: '/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png' },
      { id: 'item-6', imageUrl: '/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png' }
    ]
  },
  {
    id: 'collection-3',
    title: 'Topps Project70',
    coverImage: '/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png',
    owner: '@topps_official',
    itemCount: 700,
    items: [
      { id: 'item-7', imageUrl: '/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png' },
      { id: 'item-8', imageUrl: '/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png' },
      { id: 'item-9', imageUrl: '/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png' }
    ]
  },
];

interface CardCollectionViewProps {
  onCardClick: (cardId: string) => void;
}

const CardCollectionView: React.FC<CardCollectionViewProps> = ({ onCardClick }) => {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState('recent');
  
  const handleCreateCollection = () => {
    // In a real app, this would navigate to a collection creation page
    navigate('/create-collection');
  };
  
  // Sort collections based on selected option
  const sortedCollections = [...COLLECTIONS].sort((a, b) => {
    switch (sortOption) {
      case 'alpha':
        return a.title.localeCompare(b.title);
      case 'items':
        return b.itemCount - a.itemCount;
      case 'recent':
      default:
        return 0; // For demo purposes, we'll keep the original order for 'recent'
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Featured in these Collections</h1>
        <Button onClick={handleCreateCollection} className="bg-green-500 hover:bg-green-600">
          <Plus className="h-4 w-4 mr-1" />
          Create Collection
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-400">{COLLECTIONS.length} collections</span>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400"
            onClick={() => setSortOption('recent')}
          >
            {sortOption === 'recent' && <Check className="h-4 w-4 mr-1 text-green-500" />}
            Recently Added
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400"
            onClick={() => setSortOption('alpha')}
          >
            {sortOption === 'alpha' && <Check className="h-4 w-4 mr-1 text-green-500" />}
            Alphabetical
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400"
            onClick={() => setSortOption('items')}
          >
            {sortOption === 'items' && <Check className="h-4 w-4 mr-1 text-green-500" />}
            Most Items
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedCollections.map((collection) => (
          <CollectionCard 
            key={collection.id}
            collection={collection}
            onCardClick={onCardClick}
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="bg-gray-900 border-gray-700 text-white">
          <ChevronsUpDown className="mr-2 h-4 w-4" />
          Show all collections
        </Button>
      </div>
    </div>
  );
};

interface CollectionCardProps {
  collection: any;
  onCardClick: (cardId: string) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onCardClick }) => {
  return (
    <Card 
      className="overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
      onClick={() => console.log('View collection', collection.id)}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={collection.coverImage} 
          alt={collection.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{collection.title}</h3>
        <div className="flex items-center text-sm text-gray-400">
          <span>By {collection.owner}</span>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-1">
          {collection.items.map((item, index) => (
            <div 
              key={item.id}
              className="aspect-square overflow-hidden rounded-md cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onCardClick(item.id);
              }}
            >
              <img 
                src={item.imageUrl} 
                alt={`Collection item ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-3 text-sm">
          <span className="font-medium">{collection.itemCount} ITEMS</span>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Star className="h-4 w-4 text-gray-400" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Activity className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardCollectionView;
