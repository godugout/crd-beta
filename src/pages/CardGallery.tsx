
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardGalleryComponent from '@/components/CardGallery';
import { cardsNavItems } from '@/config/navigation';
import ContentTypeNavigation from '@/components/navigation/ContentTypeNavigation';
import { useCards } from '@/hooks/useCards';
import { basketballCards } from '@/data/basketballCards';
import { Card } from '@/lib/types';

const CardGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { cards, loading } = useCards();
  
  console.log('CardGallery page - cards from hook:', cards.length);
  console.log('CardGallery page - basketball cards available:', basketballCards.length);

  // Create navigation items for content type navigation
  const navigationItems = cardsNavItems.map(item => ({
    label: item.label,
    path: item.path,
    icon: item.icon ? <item.icon className="h-4 w-4" /> : undefined,
    description: item.description
  }));

  // Ensure we always have the basketball cards available
  const cardsToDisplay = cards && cards.length > 0 ? cards : basketballCards;
  
  console.log('CardGallery page - final cards to display:', cardsToDisplay.length);

  return (
    <PageLayout
      title="Card Gallery"
    >
      <div className="container mx-auto max-w-6xl px-4 py-4">
        {/* Add search functionality directly to the page */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:border-[var(--brand-primary)] focus:outline-none"
            />
          </div>
        </div>
        
        <div className="mb-8">
          <ContentTypeNavigation 
            items={navigationItems}
            variant="pills"
          />
        </div>
        
        {/* Show basketball collection highlight if we have basketball cards */}
        {cardsToDisplay.some(card => card.tags?.includes('basketball')) && (
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-lg border border-orange-500/20">
            <h2 className="text-lg font-semibold text-orange-400 mb-2">🏀 Basketball Legends Collection</h2>
            <p className="text-gray-300 text-sm">
              Featuring iconic NBA players with unique colored backgrounds and special effects
            </p>
          </div>
        )}
        
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
