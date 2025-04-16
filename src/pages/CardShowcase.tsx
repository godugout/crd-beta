
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardGrid from '@/components/cards/CardGrid';
import FilterPanel from '@/components/filters/FilterPanel';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import { Card } from '@/lib/types';

const sampleCards: Card[] = [
  {
    id: '1',
    title: 'Michael Jordan',
    description: 'The GOAT',
    imageUrl: '/basketball-mj.jpg',
    thumbnailUrl: '/basketball-mj-thumb.jpg',
    tags: ['basketball', 'legends', 'bulls'],
    userId: 'user1',
    effects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designMetadata: DEFAULT_DESIGN_METADATA
  },
  {
    id: '2',
    title: 'LeBron James',
    description: 'King James',
    imageUrl: '/basketball-lebron.jpg',
    thumbnailUrl: '/basketball-lebron-thumb.jpg',
    tags: ['basketball', 'current', 'lakers'],
    userId: 'user1',
    effects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designMetadata: DEFAULT_DESIGN_METADATA
  }
];

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
      title="Card Showcase"
      description="Browse and discover unique digital trading cards"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Card Showcase</h1>
          
          <Button onClick={() => navigate('/create')} className="flex items-center gap-2">
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
              cards={sampleCards} 
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
