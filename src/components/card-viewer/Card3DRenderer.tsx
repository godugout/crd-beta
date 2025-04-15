import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { toast } from 'sonner';
import CardDiagnostics from './CardDiagnostics';
import { useCardMaterials } from '@/hooks/card-effects/useCardMaterials';
import { useCardRotation } from '@/hooks/card-effects/useCardRotation';

interface Card3DRendererProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
}

const Card3DRenderer: React.FC<Card3DRendererProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities = {}
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const edgeGlowRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [renderingStats, setRenderingStats] = useState({
    imageLoaded: false,
    textureApplied: false,
    effectsApplied: activeEffects,
    errors: [] as string[],
    warnings: [] as string[],
    renderTime: 0,
    meshCount: 0,
    transformations: [] as string[]
  });
  
  // Define paths for textures with proper fallback handling
  const frontTexturePath = card.imageUrl || '/images/card-placeholder.png';
  const backTexturePath = card.thumbnailUrl || '/images/card-back-placeholder.png';

  // Load textures
  const [frontTexture, backTexture] = useTexture([frontTexturePath, backTexturePath], (textures) => {
    console.log('Card textures loaded:', textures);
    setRenderingStats(prev => ({
      ...prev,
      imageLoaded: true,
      warnings: prev.warnings.filter(w => !w.includes('texture loading'))
    }));
  });

  const { rotationSpeed, setRotationSpeed, handleWheel } = useCardRotation();
  const { shaderMaterial, glowMaterial } = useCardMaterials(frontTexture, backTexture, isFlipped);

  useEffect(() => {
    if (frontTexture && backTexture) {
      console.log('Setting up textures for card:', card.id);
      [frontTexture, backTexture].forEach(texture => {
        texture.encoding = THREE.sRGBEncoding;
        texture.needsUpdate = true;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
      });
      
      setRenderingStats(prev => ({
        ...prev,
        textureApplied: true
      }));
    }
  }, [frontTexture, backTexture, card.id]);

  useEffect(() => {
    console.log('Card3DRenderer mounted with card:', card.id, 'and effects:', activeEffects);
    return () => {
      console.log('Card3DRenderer unmounting for card:', card.id);
    };
  }, [card.id, activeEffects]);

  useEffect(() => {
    const container = gl.domElement.parentElement;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [gl, handleWheel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setShowDiagnostics(prev => !prev);
        toast.info(showDiagnostics ? 'Diagnostics hidden' : 'Diagnostics shown', {
          id: 'diagnostics-toggle'
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDiagnostics]);

  // Update card rotation and shader uniforms
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Record the transformation before applying changes
      const currentTransform = {
        position: meshRef.current.position.clone(),
        rotation: new THREE.Euler().copy(meshRef.current.rotation),
        scale: meshRef.current.scale.clone()
      };
      
      // Apply rotation
      meshRef.current.rotation.y += rotationSpeed * delta;
      setRotationSpeed(prev => prev * 0.95);
      
      // Update material uniforms
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
        materialRef.current.uniforms.isFlipped.value = isFlipped;
      }
      
      // Update glow material and sync with card
      if (edgeGlowRef.current?.material) {
        const glowMaterial = edgeGlowRef.current.material as THREE.ShaderMaterial;
        glowMaterial.uniforms.time.value = state.clock.getElapsedTime();
        
        edgeGlowRef.current.position.copy(meshRef.current.position);
        edgeGlowRef.current.rotation.copy(meshRef.current.rotation);
      }
      
      // Log significant transformations (throttled to avoid flooding console)
      if (state.clock.getElapsedTime() % 1 < delta) {
        setRenderingStats(prev => {
          const newTransformations = [...prev.transformations];
          newTransformations.push(
            `Time: ${state.clock.getElapsedTime().toFixed(2)}, Pos: (${meshRef.current?.position.x.toFixed(2)},${meshRef.current?.position.y.toFixed(2)}), Rot: (${meshRef.current?.rotation.x.toFixed(2)},${meshRef.current?.rotation.y.toFixed(2)})`
          );
          
          // Keep only most recent 10 transformations
          if (newTransformations.length > 10) {
            newTransformations.shift();
          }
          
          return {
            ...prev,
            transformations: newTransformations,
            meshCount: state.scene.children.filter(child => child instanceof THREE.Mesh).length,
            renderTime: state.clock.getDelta() * 1000 // in ms
          };
        });
      }
    }
  });

  // Card dimensions with increased thickness
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.15; // Thicker card as requested

  return (
    <>
      {/* Debug overlay that shows mesh count */}
      {showDiagnostics && (
        <group position={[0, 3.5, 0]}>
          <mesh>
            <planeGeometry args={[4, 1]} />
            <meshBasicMaterial color="black" transparent opacity={0.7} />
          </mesh>
          <Html position={[0, 0, 0.1]}>
            <div style={{ color: 'white', fontSize: '12px', padding: '5px', width: '300px', textAlign: 'center' }}>
              Meshes: {renderingStats.meshCount} | Render: {renderingStats.renderTime.toFixed(2)}ms | Card ID: {card.id}
            </div>
          </Html>
        </group>
      )}

      {/* Main card mesh */}
      <mesh 
        ref={meshRef} 
        rotation={[0, isFlipped ? Math.PI : 0, 0]}
        onClick={() => console.log('Card clicked, isFlipped:', isFlipped)}
      >
        <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </mesh>
      
      {/* Glowing edge mesh that wraps around main card */}
      <mesh 
        ref={edgeGlowRef} 
        rotation={[0, isFlipped ? Math.PI : 0, 0]}
        onClick={() => console.log('Edge glow clicked')}
      >
        <boxGeometry args={[cardWidth + 0.05, cardHeight + 0.05, cardThickness + 0.05]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>
      
      <CardDiagnostics
        card={card}
        isVisible={showDiagnostics}
        renderingStats={renderingStats}
      />
    </>
  );
};

export default Card3DRenderer;
