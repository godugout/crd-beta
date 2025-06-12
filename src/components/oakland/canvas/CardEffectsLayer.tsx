
import React from 'react';
import * as THREE from 'three';

interface CardEffectsLayerProps {
  showEffects: boolean;
  svgOverlays: Array<{
    id: string;
    position: { x: number; y: number };
    scale: number;
    opacity: number;
    color: string;
  }>;
  canvasEffects: Array<{
    id: string;
    type: string;
    settings: Record<string, any>;
    blendMode: string;
    opacity: number;
  }>;
  cardFinish: 'matte' | 'glossy' | 'foil';
  cardSize: {
    width: number;
    height: number;
  };
}

const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  svgOverlays,
  canvasEffects,
  cardFinish,
  cardSize
}) => {
  if (!showEffects) {
    return null;
  }

  const { width, height } = cardSize;

  return (
    <group>
      {/* SVG Overlays as 3D elements */}
      {svgOverlays.map((overlay, index) => (
        <mesh
          key={overlay.id}
          position={[
            (overlay.position.x - 0.5) * width,
            (0.5 - overlay.position.y) * height,
            0.001 + index * 0.001
          ]}
          scale={[overlay.scale, overlay.scale, 1]}
        >
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial
            color={overlay.color}
            transparent
            opacity={overlay.opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Enhanced holographic overlay for special designs */}
      {(cardFinish === 'foil' || canvasEffects.some((e) => e.type === 'gradient')) && (
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          >
            <primitive 
              object={new THREE.Color().setHSL(
                (Date.now() * 0.0005) % 1, 
                0.3, 
                0.7
              )} 
              attach="color"
            />
          </meshBasicMaterial>
        </mesh>
      )}

      {/* Canvas Effects Visual Indicators */}
      {canvasEffects.map((effect, index) => {
        if (effect.type === 'noise') {
          return (
            <mesh
              key={effect.id}
              position={[0, 0, 0.002 + index * 0.0005]}
            >
              <planeGeometry args={[width * 0.9, height * 0.9]} />
              <meshBasicMaterial
                transparent
                opacity={effect.opacity * 0.1}
                color="#888888"
                blending={THREE.MultiplyBlending}
              />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
};

export default CardEffectsLayer;
