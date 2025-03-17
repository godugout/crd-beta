
import React, { CSSProperties } from 'react';
import { CardData } from '@/types/card';

interface CardContainerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  isMoving: boolean;
  effectSettings: {
    motionSpeed: number;
    pulseIntensity: number;
    shimmerSpeed: number;
    goldIntensity: number;
    chromeIntensity: number;
    vintageIntensity: number;
  };
  children: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({
  containerRef,
  onMouseMove,
  isMoving,
  effectSettings,
  children
}) => {
  const containerStyle: CSSProperties = {
    '--motion-speed': `${effectSettings.motionSpeed}`,
    '--pulse-intensity': `${effectSettings.pulseIntensity}`,
    '--shimmer-speed': `${effectSettings.shimmerSpeed}s`,
    '--gold-intensity': `${effectSettings.goldIntensity}`,
    '--chrome-intensity': `${effectSettings.chromeIntensity}`,
    '--vintage-intensity': `${effectSettings.vintageIntensity}`
  } as CSSProperties;

  return (
    <div 
      ref={containerRef}
      className={`card-3d-container relative w-80 h-[450px] flex items-center justify-center transition-transform duration-200 ${isMoving ? 'mouse-move' : 'dynamic-card floating-card'}`}
      onMouseMove={onMouseMove}
      style={containerStyle}
    >
      {children}
    </div>
  );
};

export default CardContainer;
