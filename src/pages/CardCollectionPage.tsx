
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardGrid from '@/components/cards/CardGrid';
import FilterPanel from '@/components/filters/FilterPanel';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/lib/types';

const CardCollectionPage: React.FC = () => {
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
      title="Card Collection"
      description="Browse and discover unique digital cards"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Card Collection</h1>
          
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
              cards={[]} 
              onCardClick={(id) => navigate(`/cards/${id}`)}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardCollectionPage;
