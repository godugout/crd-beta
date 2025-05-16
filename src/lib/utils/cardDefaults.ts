
import { CardMetadata, CardMarketMetadata } from '@/lib/types/cardTypes';

export const DEFAULT_CARD_METADATA: CardMetadata = {
  category: 'general',
  series: 'base',
  cardType: 'standard',
};

export const DEFAULT_MARKET_METADATA: CardMarketMetadata = {
  price: 0,
  currency: 'USD',
  availableForSale: false,
  editionSize: 1,
  editionNumber: 1,
  isPrintable: false,
  isForSale: false,
  includeInCatalog: false,
};
