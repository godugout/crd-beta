
import React, { useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import { useParams } from 'react-router-dom';
import { useCardContext } from '@/context/CardContext';

const ImmersiveCardViewer = ({ card: initialCard }: { card: Card }) => {
  const { id } = useParams();
  const { getCardById } = useCardContext();
  const [card, setCard] = useState<Card>(initialCard);
  
  useEffect(() => {
    if (id) {
      const foundCard = getCardById(id);
      if (foundCard) {
        setCard(foundCard);
      }
    }
  }, [id, getCardById]);

  return (
    <div>
      {/* Display card stats */}
      {card.stats?.battingAverage && <span className="text-sm">{card.stats.battingAverage}</span>}
      {card.stats?.homeRuns && <span className="text-sm">{card.stats.homeRuns}</span>}
      {card.stats?.rbis && <span className="text-sm">{card.stats.rbis}</span>}
      {card.stats?.era && <span className="text-sm">{card.stats.era}</span>}
      {card.stats?.wins && <span className="text-sm">{card.stats.wins}</span>}
      {card.stats?.strikeouts && <span className="text-sm">{card.stats.strikeouts}</span>}
      {card.stats?.careerYears && <span className="text-sm">{card.stats.careerYears}</span>}
      {card.stats?.ranking && <span className="text-sm">{card.stats.ranking}</span>}
    </div>
  );
};

export default ImmersiveCardViewer;
