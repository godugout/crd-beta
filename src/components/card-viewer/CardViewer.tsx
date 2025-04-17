
import React from 'react';
import { Card } from '@/lib/types/card';
import CardViewerComponent from '@/components/card-viewer/CardViewer';

interface CardViewerProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  showLightingControls?: boolean;
  isFullscreen?: boolean;
}

export const CardViewer: React.FC<CardViewerProps> = (props) => {
  return <CardViewerComponent {...props} />;
};

export default CardViewer;
