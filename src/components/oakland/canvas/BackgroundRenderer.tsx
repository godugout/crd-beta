
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import { BackgroundSettings } from './BackgroundSelector';
import * as THREE from 'three';

interface BackgroundRendererProps {
  settings: BackgroundSettings;
}

const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({ settings }) => {
  // Create gradient or solid background texture
  const backgroundTexture = useMemo(() => {
    if (settings.type === 'gradient' && settings.gradient) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, settings.gradient.from);
        gradient.addColorStop(1, settings.gradient.to);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        return texture;
      }
    }
    
    if (settings.type === 'solid' && settings.solid) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = settings.solid;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        return texture;
      }
    }
    
    return null;
  }, [settings]);

  // Handle HDR preset environments
  if (settings.type === 'preset' && settings.preset) {
    return (
      <Environment 
        preset={settings.preset as any}
        background={true}
        backgroundIntensity={settings.intensity}
        backgroundBlurriness={settings.blur}
        backgroundRotation={[0, (settings.rotation * Math.PI) / 180, 0]}
        environmentIntensity={settings.intensity}
        environmentRotation={[0, (settings.rotation * Math.PI) / 180, 0]}
      />
    );
  }

  // Handle custom textures (gradient/solid)
  if (backgroundTexture) {
    return (
      <Environment 
        map={backgroundTexture}
        background={true}
        backgroundIntensity={settings.intensity}
        backgroundBlurriness={settings.blur}
        backgroundRotation={[0, (settings.rotation * Math.PI) / 180, 0]}
        environmentIntensity={settings.intensity * 0.5}
      />
    );
  }

  // Fallback to default studio environment
  return (
    <Environment 
      preset="studio"
      background={true}
      backgroundIntensity={settings.intensity}
      backgroundBlurriness={settings.blur}
      environmentIntensity={settings.intensity}
    />
  );
};

export default BackgroundRenderer;
