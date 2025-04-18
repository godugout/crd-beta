
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardGrid from '@/components/cards/CardGrid';
import FilterPanel from '@/components/filters/FilterPanel';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import { Card } from '@/lib/types';
import { sampleCards } from '@/data/sampleCards';

// Map the basketball player sample cards to the Card type
const basketballCards: Card[] = sampleCards.map(card => ({
  id: card.id,
  title: card.title,
  description: card.description,
  imageUrl: card.imageUrl,
  thumbnailUrl: card.thumbnailUrl || card.imageUrl,
  tags: card.tags || [],
  userId: card.userId,
  effects: card.effects || [],
  createdAt: card.createdAt,
  updatedAt: card.updatedAt,
  designMetadata: {
    cardStyle: {
      template: 'classic',
      effect: 'none',
      borderRadius: '12px',
      borderColor: '#000000',
      shadowColor: 'rgba(0,0,0,0.2)',
      frameWidth: 2,
      frameColor: '#000000'
    },
    textStyle: {
      titleColor: '#000000',
      titleAlignment: 'center',
      titleWeight: 'bold',
      descriptionColor: '#666666'
    },
    cardMetadata: {
      category: 'sports',
      series: 'basketball',
      cardType: 'player',
    },
    marketMetadata: {
      isPrintable: false,
      isForSale: false,
      includeInCatalog: true
    }
  },
  player: card.player,
  team: card.team,
  year: card.year
}));

const CardShowcase: React.FC = () => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    tags: [],
    sortBy: 'newest'
  });
  const navigate = useNavigate();

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <PageLayout
      title="Basketball Card Showcase"
      description="Browse and discover unique basketball player trading cards"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Basketball Card Collection</h1>
          
          <Button onClick={() => navigate('/cards/create')} className="flex items-center gap-2">
            <PlusCircle size={18} />
            Create New
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <FilterPanel 
              filters={filters} 
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="md:col-span-3">
            <CardGrid 
              cards={basketballCards} 
              searchQuery={filters.searchQuery}
              selectedTags={filters.tags}
              sortBy={filters.sortBy}
              onCardClick={(id) => navigate(`/cards/${id}`)}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardShowcase;
