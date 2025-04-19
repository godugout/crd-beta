
export type MemorabiliaType = 'card' | 'ticket' | 'program' | 'autograph' | 'face' | 'unknown';

export interface DetectedMemorabiliaItem {
  type: MemorabiliaType;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  metadata?: Record<string, any>;
}

export const detectMemorabiliaType = async (
  imageData: string | Blob
): Promise<DetectedMemorabiliaItem[]> => {
  // For now, this is a placeholder implementation
  // In a real app, this would call a machine learning model or API
  console.log('Detecting memorabilia type from image...');
  
  return [
    {
      type: 'card',
      confidence: 0.85,
      boundingBox: {
        x: 10,
        y: 10,
        width: 200,
        height: 300
      }
    }
  ];
};
