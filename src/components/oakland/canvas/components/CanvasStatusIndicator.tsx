
import React from 'react';
import { BackgroundSettings } from '../BackgroundSelector';

interface CanvasStatusIndicatorProps {
  viewMode: '3d' | '2d';
  cardFinish: 'matte' | 'glossy' | 'foil';
  backgroundSettings: BackgroundSettings;
}

const CanvasStatusIndicator: React.FC<CanvasStatusIndicatorProps> = ({
  viewMode,
  cardFinish,
  backgroundSettings
}) => (
  <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm rounded px-2 py-1 select-none">
    {viewMode.toUpperCase()} • {cardFinish} finish • {backgroundSettings.type} background • Enhanced controls
  </div>
);

export default CanvasStatusIndicator;
