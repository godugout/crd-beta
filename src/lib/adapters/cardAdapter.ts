
import { Card } from '../types/cardTypes';

/**
 * Adapts any object to a Card type
 * This is useful for handling data from external sources
 */
export function adaptToCard(data: any): Card {
  return {
    id: data.id || `card-${Date.now()}`,
    title: data.title || 'Untitled Card',
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    thumbnailUrl: data.thumbnailUrl || data.imageUrl || '',
    tags: data.tags || [],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    userId: data.userId || 'unknown',
    effects: data.effects || [],
    player: data.player || '',
    team: data.team || '',
    year: data.year || '',
    designMetadata: data.designMetadata || {
      cardStyle: {
        template: 'standard',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        shadowColor: 'rgba(0,0,0,0.1)',
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
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 0,
        editionNumber: 0,
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false
      }
    }
  };
}
