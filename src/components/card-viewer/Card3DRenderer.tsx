
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import { toast } from 'sonner';
import CardDiagnostics from './CardDiagnostics';
import { useCardMaterials } from '@/hooks/card-effects/useCardMaterials';
import { useCardRotation } from '@/hooks/card-effects/useCardRotation';
import { getFallbackImageUrl } from '@/lib/utils/imageUtils';

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
  const edgesRef = useRef<THREE.Mesh>(null);
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
  const [textureUrls, setTextureUrls] = useState({
    front: '',
    back: ''
  });
  
  // Make sure we have valid texture URLs
  useEffect(() => {
    // Get reliable fallback images from unsplash if needed
    const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
    
    const frontUrl = card.imageUrl || getFallbackImageUrl(card.tags, card.title);
    const backUrl = card.thumbnailUrl || frontUrl;
    
    console.log(`Card3DRenderer: Using front texture ${frontUrl}`);
    console.log(`Card3DRenderer: Using back texture ${backUrl}`);
    
    setTextureUrls({
      front: frontUrl,
      back: backUrl
    });
  }, [card]);

  // Only load textures after we have valid URLs
  const [frontTexture, backTexture] = useTexture(
    [textureUrls.front, textureUrls.back], 
    (textures) => {
      console.log('Card textures loaded:', textures);
      setRenderingStats(prev => ({
        ...prev,
        imageLoaded: true,
        warnings: prev.warnings.filter(w => !w.includes('texture loading'))
      }));
    },
    (error) => {
      console.error('Error loading textures:', error);
      setRenderingStats(prev => ({
        ...prev,
        errors: [...prev.errors, `Failed to load textures: ${error.message}`]
      }));
      
      // Display error message
      toast.error("Problem loading card textures", {
        description: "Using fallback images instead"
      });
    }
  );

  const { rotationSpeed, setRotationSpeed, handleWheel } = useCardRotation();
  const { shaderMaterial, glowMaterial, edgeMaterial } = useCardMaterials(frontTexture, backTexture, isFlipped);

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

  // Only render the card if we have valid textures
  if (!textureUrls.front || !textureUrls.back) {
    return (
      <Html center>
        <div className="bg-red-900/80 text-white p-4 rounded-lg">
          <div className="text-center">
            <p className="font-bold mb-2">Loading card textures...</p>
            <div className="w-8 h-8 border-4 border-t-transparent animate-spin rounded-full mx-auto"></div>
          </div>
        </div>
      </Html>
    );
  }

  return (
    <group>
      <mesh 
        ref={meshRef}
        rotation={[0, isFlipped ? Math.PI : 0, 0]}
      >
        {/* Card mesh */}
        <boxGeometry args={[3, 4, 0.05]} />
        <primitive object={shaderMaterial} attach="material" />
      </mesh>
      
      {/* Edge glow for effects */}
      <mesh 
        ref={edgeGlowRef}
        scale={[3.05, 4.05, 0.1]}
        position={[0, 0, -0.01]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>
      
      {/* Card edges */}
      <mesh 
        ref={edgesRef}
        scale={[3.05, 4.05, 0.15]}
        position={[0, 0, 0]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>
      
      {/* Diagnostics overlay */}
      {showDiagnostics && (
        <CardDiagnostics 
          stats={renderingStats}
          position={[0, 2.5, 0.5]}
        />
      )}
    </group>
  );
};

export default Card3DRenderer;
