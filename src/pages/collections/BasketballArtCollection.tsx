
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardGrid from '@/components/cards/CardGrid';
import { useNavigate } from 'react-router-dom';
import { sampleCards } from '@/data/sampleCards';
import { Card } from '@/lib/types';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

const BasketballArtCollection: React.FC = () => {
  const navigate = useNavigate();
  
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

  return (
    <PageLayout
      title="Basketball Art Collection"
      description="Discover unique basketball player art cards"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Basketball Art Collection</h1>
          <p className="text-gray-600 mt-2">
            A unique collection reimagining legendary basketball players and moments through creative artwork
          </p>
        </div>
        
        <CardGrid 
          cards={basketballCards}
          onCardClick={(id) => navigate(`/cards/${id}`)}
          className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
        />
      </div>
    </PageLayout>
  );
};

export default BasketballArtCollection;
