
import { EnhancedCropBoxProps, MemorabiliaType } from '@/components/card-upload/cardDetection';

/**
 * Determines which detection types to use based on the selected mode
 */
export const getDetectionTypesByMode = (detectionType: 'face' | 'memorabilia' | 'mixed' | 'group'): MemorabiliaType[] => {
  switch (detectionType) {
    case 'face':
    case 'group':
      return ['face'];
    case 'memorabilia':
      return ['card', 'ticket', 'program', 'autograph'];
    case 'mixed':
    default:
      return ['face', 'card', 'ticket', 'program', 'autograph'];
  }
};

/**
 * Simulates detection of items in an image
 * This would be replaced with actual ML detection in production
 */
export const simulateItemDetection = (
  imgWidth: number, 
  imgHeight: number, 
  detectionTypes: MemorabiliaType[]
): EnhancedCropBoxProps[] => {
  const detectedItems: EnhancedCropBoxProps[] = [];
  
  // Simulate face detection with grid arrangement
  if (detectionTypes.includes('face')) {
    const faceCount = Math.floor(Math.random() * 6) + 2; // 2-7 faces
    const gridColumns = Math.ceil(Math.sqrt(faceCount));
    const cellWidth = imgWidth / gridColumns;
    const cellHeight = imgHeight / gridColumns;
    
    for (let i = 0; i < faceCount; i++) {
      const row = Math.floor(i / gridColumns);
      const col = i % gridColumns;
      
      // Add some randomness to position within cell
      const offsetX = cellWidth * 0.1 * (Math.random() - 0.5);
      const offsetY = cellHeight * 0.1 * (Math.random() - 0.5);
      
      // Face size is proportional to cell but with some variation
      const faceWidth = cellWidth * (0.7 + Math.random() * 0.2);
      const faceHeight = faceWidth * 1.3; // approx face proportions
      
      detectedItems.push({
        id: `face-${i + 1}`, // Change from number to string
        x: col * cellWidth + offsetX + cellWidth * 0.15,
        y: row * cellHeight + offsetY + cellHeight * 0.1,
        width: faceWidth,
        height: faceHeight,
        rotation: Math.random() * 10 - 5, // slight random rotation
        color: '#FF5733',
        memorabiliaType: 'face',
        confidence: 0.75 + (Math.random() * 0.2)
      });
    }
  }
  
  // Simulate memorabilia detection if selected
  if (detectionTypes.some(type => ['card', 'ticket', 'program', 'autograph'].includes(type))) {
    // Place a card in the center lower part
    detectedItems.push({
      id: `card-1`, // Change from number to string
      x: imgWidth * 0.3,
      y: imgHeight * 0.6,
      width: imgWidth * 0.4,
      height: imgWidth * 0.4 * 1.4, // Card aspect ratio
      rotation: 0,
      color: '#33FF57',
      memorabiliaType: 'card',
      confidence: 0.9
    });
    
    // Add a ticket
    if (detectionTypes.includes('ticket')) {
      detectedItems.push({
        id: `ticket-1`, // Change from number to string
        x: imgWidth * 0.1,
        y: imgHeight * 0.3,
        width: imgWidth * 0.3,
        height: imgWidth * 0.15,
        rotation: 3,
        color: '#3357FF',
        memorabiliaType: 'ticket',
        confidence: 0.85
      });
    }
  }
  
  return detectedItems;
};
