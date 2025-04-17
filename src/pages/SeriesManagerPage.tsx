import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import { Series } from '@/lib/types/enhancedCardTypes';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Box, ListFilter } from 'lucide-react';

const SeriesManagerPage = () => {
  const navigate = useNavigate();
  const { series, fetchSeries, loading } = useEnhancedCards();
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
  const [filter, setFilter] = useState('all');
  
  // Add isLoading property if it doesn't exist in EnhancedCardContextProps
  const isLoading = loading;
  
  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);
  
  useEffect(() => {
    if (filter === 'all') {
      setFilteredSeries(series);
    } else if (filter === 'published') {
      setFilteredSeries(series.filter(s => s.isPublished));
    } else if (filter === 'drafts') {
      setFilteredSeries(series.filter(s => !s.isPublished));
    }
  }, [series, filter]);
  
  const handleCreateSeries = () => {
    navigate('/series/new');
  };
  
  const handleViewSeries = (id: string) => {
    navigate(`/series/${id}`);
  };
  
  const handleEditSeries = (id: string) => {
    navigate(`/series/edit/${id}`);
  };
  
  return (
    <PageLayout
      title="Manage Series"
      description="Create, edit, and manage your card series"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Series Management</h2>
          <Button onClick={handleCreateSeries}>
            <Plus className="mr-2 h-4 w-4" />
            Create Series
          </Button>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant={filter === 'all' ? 'secondary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            <Box className="mr-2 h-4 w-4" />
            All Series
          </Button>
          <Button
            variant={filter === 'published' ? 'secondary' : 'outline'}
            onClick={() => setFilter('published')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Published
          </Button>
          <Button
            variant={filter === 'drafts' ? 'secondary' : 'outline'}
            onClick={() => setFilter('drafts')}
          >
            <ListFilter className="mr-2 h-4 w-4" />
            Drafts
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Loading series...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeries.map(series => (
              <div
                key={series.id}
                className="bg-background rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewSeries(series.id)}
              >
                <h3 className="text-lg font-semibold mb-2">{series.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{series.description}</p>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSeries(series.id);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredSeries.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No series found</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SeriesManagerPage;
