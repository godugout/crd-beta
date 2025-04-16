
import React from 'react';
import { Card } from '@/lib/types';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

interface InfoPanelProps {
  card: Card;
  showInfo?: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ card, showInfo = true }) => {
  // Ensure we have valid metadata by using defaults when needed
  const designMetadata = card.designMetadata || DEFAULT_DESIGN_METADATA;
  const cardMetadata = designMetadata.cardMetadata || DEFAULT_DESIGN_METADATA.cardMetadata;
  const marketMetadata = designMetadata.marketMetadata || DEFAULT_DESIGN_METADATA.marketMetadata;

  if (!showInfo) {
    return null;
  }

  // Helper function to safely convert any value to a renderable string
  const toDisplayString = (value: any): string => {
    if (value === undefined || value === null) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Card Details</h3>
          <p>Card Number: {toDisplayString(cardMetadata.cardNumber || 'N/A')}</p>
          <p>Card Type: {toDisplayString(cardMetadata.cardType || 'Standard')}</p>
          <p>Series: {toDisplayString(cardMetadata.series || 'Base')}</p>
          <p>Artist: {toDisplayString(cardMetadata.artist || 'Unknown')}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Market Info</h3>
          <p>Printable: {marketMetadata.isPrintable ? 'Yes' : 'No'}</p>
          <p>For Sale: {marketMetadata.isForSale ? 'Yes' : 'No'}</p>
          <p>In Catalog: {marketMetadata.includeInCatalog ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
