
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEnhancedCards } from '@/context/CardEnhancedContext';
import PageLayout from '@/components/navigation/PageLayout';
import SeriesManager from '@/components/series/SeriesManager';

const SeriesManagerPage: React.FC = () => {
  const { seriesId } = useParams();
  const { series, isLoading } = useEnhancedCards();
  
  const currentSeries = seriesId ? series.find(s => s.id === seriesId) : undefined;
  
  return (
    <PageLayout
      title={currentSeries ? 'Edit Series' : 'Create Series'}
      description={currentSeries ? 'Update your card series' : 'Create a new card series'}
    >
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <SeriesManager initialSeries={currentSeries} />
        )}
      </div>
    </PageLayout>
  );
};

export default SeriesManagerPage;
