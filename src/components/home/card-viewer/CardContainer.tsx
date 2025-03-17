
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
    refractorIntensity: number;
    spectralIntensity: number;
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
    '--vintage-intensity': `${effectSettings.vintageIntensity}`,
    '--refractor-intensity': `${effectSettings.refractorIntensity}`,
    '--hologram-intensity': `${effectSettings.spectralIntensity}`
  } as CSSProperties;

  return (
    <div 
      ref={containerRef}
      className={`card-3d-container relative w-80 h-[450px] flex items-center justify-center transition-transform duration-500 ${isMoving ? 'mouse-move' : 'dynamic-card floating-card'}`}
      onMouseMove={onMouseMove}
      style={containerStyle}
    >
      {/* Add subtle shadow for more depth and natural look */}
      <div className="absolute inset-0 rounded-2xl opacity-30 blur-xl bg-gradient-to-br from-black/30 via-transparent to-black/30 -z-10"></div>
      
      {/* Natural card reflection */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-gradient-to-t from-black/10 to-transparent blur-xl opacity-20 rounded-full -z-10"></div>
      
      {children}
    </div>
  );
};

export default CardContainer;
