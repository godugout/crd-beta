
import React, { useEffect, useState } from 'react';
import { StadiumEnvironment } from './environments/StadiumEnvironment';
import { GalleryEnvironment } from './environments/GalleryEnvironment';
import { CosmicEnvironment } from './environments/CosmicEnvironment';
import { UnderwaterEnvironment } from './environments/UnderwaterEnvironment';
import { StudioEnvironment } from './environments/StudioEnvironment';
import { NightSkyEnvironment } from './environments/NightSkyEnvironment';
import { RetroArcadeEnvironment } from './environments/RetroArcadeEnvironment';
import { ForestEnvironment } from './environments/ForestEnvironment';
import { LuxuryEnvironment } from './environments/LuxuryEnvironment';
import { CyberpunkEnvironment } from './environments/CyberpunkEnvironment';

interface EnvironmentRendererProps {
  environmentType: string;
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ environmentType }) => {
  console.log('EnvironmentRenderer: Rendering environment type:', environmentType);

  // Use dedicated environment components for each type - no HDR fallback
  switch (environmentType) {
    case 'stadium':
      console.log('EnvironmentRenderer: Loading Stadium environment');
      return <StadiumEnvironment />;
    
    case 'gallery':
      console.log('EnvironmentRenderer: Loading Gallery environment');
      return <GalleryEnvironment />;
    
    case 'cardshop':
    case 'store':
    case 'mall':
      console.log('EnvironmentRenderer: Loading Retro Arcade environment');
      return <RetroArcadeEnvironment />;
    
    case 'cosmic':
    case 'space':
      console.log('EnvironmentRenderer: Loading Cosmic environment');
      return <CosmicEnvironment />;
    
    case 'underwater':
    case 'ocean':
      console.log('EnvironmentRenderer: Loading Underwater environment');
      return <UnderwaterEnvironment />;
      
    case 'night':
    case 'nightsky':
      console.log('EnvironmentRenderer: Loading Night Sky environment');
      return <NightSkyEnvironment />;
      
    case 'forest':
    case 'nature':
      console.log('EnvironmentRenderer: Loading Forest environment');
      return <ForestEnvironment />;
      
    case 'luxury':
    case 'lounge':
      console.log('EnvironmentRenderer: Loading Luxury environment');
      return <LuxuryEnvironment />;
      
    case 'cyberpunk':
    case 'cyber':
    case 'neon':
      console.log('EnvironmentRenderer: Loading Cyberpunk environment');
      return <CyberpunkEnvironment />;
    
    default: // studio
      console.log('EnvironmentRenderer: Loading Studio environment (default)');
      return <StudioEnvironment />;
  }
};

export default EnvironmentRenderer;
