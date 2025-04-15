
import React, { useState, useMemo } from 'react';
import { useCards } from '@/context/CardContext';
import { Card as CardType } from '@/context/CardContext';
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Users, FolderPlus } from 'lucide-react';

interface CardCollectionViewProps {
  onCardClick: (cardId: string) => void;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  cardCount: number;
}

const CardCollectionView: React.FC<CardCollectionViewProps> = ({ onCardClick }) => {
  const { cards } = useCards();
  const [newCollectionName, setNewCollectionName] = useState('');
  
  // In a real app, we would fetch collections from a backend
  // For now, let's create some dummy collections based on card categories
  const collections = useMemo(() => {
    // Group cards by category or series
    const categoryGroups: Record<string, CardType[]> = {};
    const seriesGroups: Record<string, CardType[]> = {};
    
    cards.forEach(card => {
      const category = card.designMetadata?.cardMetadata?.category;
      if (category) {
        if (!categoryGroups[category]) {
          categoryGroups[category] = [];
        }
        categoryGroups[category].push(card);
      }
      
      const series = card.designMetadata?.cardMetadata?.series;
      if (series) {
        if (!seriesGroups[series]) {
          seriesGroups[series] = [];
        }
        seriesGroups[series].push(card);
      }
    });
    
    const categoryCollections = Object.entries(categoryGroups).map(([category, groupCards]) => ({
      id: `category-${category}`,
      name: formatCategoryName(category),
      description: `A collection of ${formatCategoryName(category)} cards`,
      coverImageUrl: groupCards[0]?.imageUrl,
      cardCount: groupCards.length
    }));
    
    const seriesCollections = Object.entries(seriesGroups).map(([series, groupCards]) => ({
      id: `series-${series}`,
      name: formatSeriesName(series),
      description: `Cards from the ${formatSeriesName(series)} series`,
      coverImageUrl: groupCards[0]?.imageUrl,
      cardCount: groupCards.length
    }));
    
    return [...categoryCollections, ...seriesCollections];
  }, [cards]);
  
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      // In a real app, we would create the collection in the backend
      console.log('Creating collection:', newCollectionName);
      setNewCollectionName('');
    }
  };
  
  const handleCollectionClick = (collectionId: string) => {
    // In a real app, we would navigate to the collection detail page
    console.log('Clicked on collection:', collectionId);
  };
  
  const formatCategoryName = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const formatSeriesName = (series: string) => {
    return series
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Your Collections</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input 
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="New collection name"
            className="bg-gray-900 border-gray-700 text-white"
          />
          <Button 
            onClick={handleCreateCollection}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
          >
            <FolderPlus className="h-4 w-4" />
            Create
          </Button>
        </div>
      </div>
      
      {collections.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-600" />
          <h3 className="text-lg font-medium">No collections yet</h3>
          <p className="text-gray-400 mb-6">Create your first collection to organize your cards</p>
          <Button
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
            onClick={() => setNewCollectionName("My First Collection")}
          >
            <PlusCircle className="h-4 w-4" />
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card 
              key={collection.id}
              className="bg-gray-900 border-gray-700 text-white hover:border-gray-500 transition-colors cursor-pointer"
              onClick={() => handleCollectionClick(collection.id)}
            >
              <div className="aspect-[16/9] bg-gray-800 rounded-t-lg overflow-hidden">
                {collection.coverImageUrl ? (
                  <img 
                    src={collection.coverImageUrl} 
                    alt={collection.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderPlus className="h-12 w-12 text-gray-600" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{collection.name}</h3>
                <p className="text-sm text-gray-300 mb-2">{collection.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                    {collection.cardCount} cards
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardCollectionView;
