
import { EnhancedCropBoxProps, MemorabiliaType } from '../types/detectionTypes';
import { calculateCardDimensions, CARD_ASPECT_RATIO } from './dimensionsUtil';

export async function detectCardsInImage(
  image: HTMLImageElement,
  enhancementEnabled: boolean = true,
  canvas?: HTMLCanvasElement | null,
  detectionTypes: MemorabiliaType[] = ['card', 'ticket', 'program', 'autograph', 'face']
): Promise<EnhancedCropBoxProps[]> {
  console.log('Detecting items in image:', image.src, 'with types:', detectionTypes);
  
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const detectedItems: EnhancedCropBoxProps[] = [];
  
  if (detectionTypes.includes('card')) {
    let maxDimension = Math.min(width, height) * 0.8;
    let cardDimensions;
    
    if (width > height) {
      cardDimensions = calculateCardDimensions(maxDimension * CARD_ASPECT_RATIO, maxDimension);
    } else {
      cardDimensions = calculateCardDimensions(maxDimension, maxDimension / CARD_ASPECT_RATIO);
    }
    
    detectedItems.push({
      id: 1,
      x: (width - cardDimensions.width) / 2,
      y: (height - cardDimensions.height) / 2,
      width: cardDimensions.width,
      height: cardDimensions.height,
      rotation: 0,
      color: '#00FF00',
      memorabiliaType: 'card',
      confidence: 0.85
    });
  }
  
  if (detectedItems.length === 0) {
    const cardDimensions = calculateCardDimensions(width * 0.5, height * 0.5);
    
    detectedItems.push({
      id: 1,
      x: (width - cardDimensions.width) / 2,
      y: (height - cardDimensions.height) / 2,
      width: cardDimensions.width,
      height: cardDimensions.height,
      rotation: 0,
      color: '#FFFF33',
      memorabiliaType: 'card',
      confidence: 0.7
    });
  }
  
  return detectedItems;
}
