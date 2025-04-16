
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardGalleryComponent from '@/components/CardGallery';
import { cardsNavItems } from '@/config/navigation';
import ContentTypeNavigation from '@/components/navigation/ContentTypeNavigation';
import { useCards } from '@/hooks/useCards';
import { sampleCards } from '@/data/sampleCards';
import { Card } from '@/lib/types';

const CardGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { cards, loading } = useCards();
  
  console.log('CardGallery page received cards:', cards);
  console.log('Sample cards available:', sampleCards.length);

  // Create navigation items for content type navigation
  const navigationItems = cardsNavItems.map(item => ({
    label: item.label,
    path: item.path,
    icon: item.icon ? <item.icon className="h-4 w-4" /> : undefined,
    description: item.description
  }));

  // Determine which cards to use - if useCards() returns empty, use sampleCards directly
  const cardsToDisplay = cards && cards.length > 0 ? cards : sampleCards;

  return (
    <PageLayout
      title="Card Gallery"
      hideBreadcrumbs={false}
      onSearch={setSearchQuery}
      searchPlaceholder="Search cards..."
    >
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="mb-8">
          <ContentTypeNavigation 
            items={navigationItems}
            variant="pills"
          />
        </div>
        
        <CardGalleryComponent 
          searchQuery={searchQuery}
          cards={cardsToDisplay as Card[]} 
          isLoading={loading && cardsToDisplay.length === 0}
        />
      </div>
    </PageLayout>
  );
};

export default CardGallery;
