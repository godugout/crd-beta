
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

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Card Details</h3>
          <p>Card Number: {String(cardMetadata.cardNumber || 'N/A')}</p>
          <p>Card Type: {String(cardMetadata.cardType || 'Standard')}</p>
          <p>Series: {String(cardMetadata.series || 'Base')}</p>
          <p>Artist: {String(cardMetadata.artist || 'Unknown')}</p>
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
