
import React from 'react';
import { Link } from 'react-router-dom';
import { OaklandMemoryData, Card } from '@/lib/types';
import { OaklandTemplateType } from '../OaklandCardTemplates';
import OaklandMemoryCard from '../OaklandMemoryCard';

interface OaklandMemoryGridProps {
  cards: Array<Card>;
}

const OaklandMemoryGrid: React.FC<OaklandMemoryGridProps> = ({ cards }) => {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cards.map(card => {
        const oaklandMemory = card.designMetadata?.oaklandMemory;
        if (!oaklandMemory) return null;
        
        const memoryData: OaklandMemoryData = {
          title: card.title || card.name || '',
          description: card.description,
          date: oaklandMemory.date,
          opponent: oaklandMemory.opponent,
          score: oaklandMemory.score,
          location: oaklandMemory.location,
          section: oaklandMemory.section,
          memoryType: oaklandMemory.memoryType,
          attendees: oaklandMemory.attendees || [],
          tags: card.tags || [],
          imageUrl: oaklandMemory.imageUrl || card.imageUrl || '',
          historicalContext: oaklandMemory.historicalContext,
          personalSignificance: oaklandMemory.personalSignificance,
        };
        
        return (
          <Link key={card.id} to={`/teams/oakland/memories/${card.id}`}>
            <OaklandMemoryCard 
              memory={memoryData}
              templateType={(oaklandMemory.template as OaklandTemplateType) || 'classic'}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default OaklandMemoryGrid;
