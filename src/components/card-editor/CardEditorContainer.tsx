
import React from 'react';
import { Card } from '@/lib/types';

interface CardEditorContainerProps {
  initialMetadata?: any;
  card?: Partial<Card>;
}

const CardEditorContainer: React.FC<CardEditorContainerProps> = ({
  initialMetadata,
  card
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Card Details</h3>
        <p className="text-sm text-gray-500">
          Card editor functionality will be implemented here.
        </p>
        {card && (
          <div className="mt-4">
            <p><strong>Title:</strong> {card.title}</p>
            <p><strong>Description:</strong> {card.description}</p>
            {card.imageUrl && (
              <div className="mt-2">
                <img 
                  src={card.imageUrl} 
                  alt={card.title} 
                  className="w-32 h-auto rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardEditorContainer;
