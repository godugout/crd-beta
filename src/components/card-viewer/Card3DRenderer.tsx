
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
    renderTime: 0
  });
  
  // Define paths for textures with proper fallback handling
  const frontTexturePath = card.imageUrl || '/images/card-placeholder.png';
  const backTexturePath = card.thumbnailUrl || '/images/card-back-placeholder.png';

  // Load textures
  const [frontTexture, backTexture] = useTexture([frontTexturePath, backTexturePath], (textures) => {
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
  }, [frontTexture, backTexture]);

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
        toast.info(showDiagnostics ? 'Diagnostics hidden' : 'Diagnostics shown');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDiagnostics]);

  // Update card rotation and shader uniforms
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * delta;
      setRotationSpeed(prev => prev * 0.95);
      
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
        materialRef.current.uniforms.isFlipped.value = isFlipped;
      }
      
      if (edgeGlowRef.current?.material) {
        const glowMaterial = edgeGlowRef.current.material as THREE.ShaderMaterial;
        glowMaterial.uniforms.time.value = state.clock.getElapsedTime();
        
        edgeGlowRef.current.position.copy(meshRef.current.position);
        edgeGlowRef.current.rotation.copy(meshRef.current.rotation);
      }
    }
  });

  // Card dimensions with increased thickness
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.15;

  return (
    <>
      <mesh ref={meshRef} rotation={[0, isFlipped ? Math.PI : 0, 0]}>
        <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </mesh>
      
      <mesh ref={edgeGlowRef} rotation={[0, isFlipped ? Math.PI : 0, 0]}>
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
