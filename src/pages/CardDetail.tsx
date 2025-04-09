
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { CardData } from '@/components/baseball/types/BaseballCard';
import { useBaseballCard } from '@/components/baseball/hooks/useBaseballCard';

const CardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { cardData, isLoading, error } = useBaseballCard();

  if (isLoading) {
    return (
      <PageLayout 
        title="Loading Card" 
        description="Loading card details..."
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
      </PageLayout>
    );
  }

  if (error || !cardData) {
    return (
      <PageLayout 
        title="Card Not Found" 
        description="The requested card could not be found."
      >
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error || "Card not found"}</span>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={cardData.title} 
      description={`${cardData.year} ${cardData.player} ${cardData.team} baseball card`}
      imageUrl={cardData.imageUrl}
      type="product"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Image */}
          <div className="flex justify-center">
            <div className="max-w-md">
              <img 
                src={cardData.imageUrl} 
                alt={cardData.title} 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
          
          {/* Card Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{cardData.title}</h1>
            <p className="text-gray-600 mb-6">{cardData.manufacturer}, {cardData.year}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-sm text-gray-500">Player</p>
                <p className="font-medium">{cardData.player}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Team</p>
                <p className="font-medium">{cardData.team}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{cardData.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Card Number</p>
                <p className="font-medium">{cardData.cardNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Condition</p>
                <p className="font-medium">{cardData.condition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Value</p>
                <p className="font-medium">{cardData.value}</p>
              </div>
            </div>
            
            {/* Stats section */}
            {cardData.stats && (
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Stats</h2>
                <div className="grid grid-cols-3 gap-4">
                  {cardData.stats.battingAverage && (
                    <div>
                      <p className="text-sm text-gray-500">Batting Average</p>
                      <p className="font-medium">{cardData.stats.battingAverage}</p>
                    </div>
                  )}
                  {cardData.stats.homeRuns && (
                    <div>
                      <p className="text-sm text-gray-500">Home Runs</p>
                      <p className="font-medium">{cardData.stats.homeRuns}</p>
                    </div>
                  )}
                  {cardData.stats.rbis && (
                    <div>
                      <p className="text-sm text-gray-500">RBIs</p>
                      <p className="font-medium">{cardData.stats.rbis}</p>
                    </div>
                  )}
                  {cardData.stats.era && (
                    <div>
                      <p className="text-sm text-gray-500">ERA</p>
                      <p className="font-medium">{cardData.stats.era}</p>
                    </div>
                  )}
                  {cardData.stats.wins && (
                    <div>
                      <p className="text-sm text-gray-500">Wins</p>
                      <p className="font-medium">{cardData.stats.wins}</p>
                    </div>
                  )}
                  {cardData.stats.strikeouts && (
                    <div>
                      <p className="text-sm text-gray-500">Strikeouts</p>
                      <p className="font-medium">{cardData.stats.strikeouts}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardDetail;
