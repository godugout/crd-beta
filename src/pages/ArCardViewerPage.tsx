import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/lib/types';
import PageLayout from '@/components/navigation/PageLayout';
import ArViewerContainer from '@/components/ar/ArViewerContainer';
import { useCards } from '@/context/CardContext';

const ArCardViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cards } = useCards();
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  useEffect(() => {
    if (id && cards) {
      const card = cards.find(c => c.id === id) || null;
      setActiveCard(card);
    }
  }, [id, cards]);

  return (
    <PageLayout title="AR Card Viewer" description="View your cards in augmented reality">
      <div className="container mx-auto max-w-4xl p-4">
        <ArViewerContainer
          activeCard={activeCard}
          availableCards={cards}
        />
      </div>
    </PageLayout>
  );
};

export default ArCardViewerPage;
