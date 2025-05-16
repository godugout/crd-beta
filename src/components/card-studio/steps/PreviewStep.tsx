import React from 'react';
import { Card } from '@/lib/types/cardTypes';

interface PreviewStepProps {
  cardData: Partial<Card>;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ cardData }) => {
  // Create a complete Card object from partial data to ensure all required fields are present
  const completeCard: Card = {
    id: cardData.id || 'preview',
    title: cardData.title || 'Card Preview',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || '/placeholder.svg',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '/placeholder.svg',
    tags: cardData.tags || [],
    userId: cardData.userId || 'preview-user',
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: cardData.updatedAt || new Date().toISOString(),
    effects: cardData.effects || [],
    designMetadata: cardData.designMetadata || {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        shadowColor: 'rgba(0,0,0,0.2)',
        frameWidth: 2,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard'
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false,
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 1,
        editionNumber: 1
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Preview Your Card</h2>
      <div className="flex justify-center">
        <div className="aspect-[2.5/3.5] w-full max-w-sm border rounded-lg overflow-hidden shadow-lg"
          style={{
            borderRadius: completeCard.designMetadata.cardStyle.borderRadius || '8px',
            borderColor: completeCard.designMetadata.cardStyle.borderColor || '#000000',
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          {completeCard.imageUrl ? (
            <img 
              src={completeCard.imageUrl} 
              alt={completeCard.title}
              className="w-full h-full object-cover"
              style={{
                filter: completeCard.designMetadata.cardStyle.effect === 'vintage' ? 'sepia(0.7)' :
                       completeCard.designMetadata.cardStyle.effect === 'chrome' ? 'contrast(1.2) brightness(1.1)' : 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-400">No image selected</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 space-y-4 max-w-md mx-auto">
        <h3 className="text-lg font-medium">{completeCard.title}</h3>
        {completeCard.description && <p className="text-gray-600">{completeCard.description}</p>}
        
        {completeCard.tags && completeCard.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {completeCard.tags.map(tag => (
              <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewStep;
