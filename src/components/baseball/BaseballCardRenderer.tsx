
import React from 'react';
import { useBaseballCard } from './hooks/useBaseballCard';
import CardContainer from './components/CardContainer';

const BaseballCardRenderer: React.FC = () => {
  const { cardData, isLoading, allCards } = useBaseballCard();

  if (isLoading || !cardData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-64 h-96 bg-gray-800 rounded-lg"></div>
          <div className="mt-4 h-4 bg-gray-800 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return <CardContainer cardData={cardData} allCards={allCards} />;
};

export default BaseballCardRenderer;
