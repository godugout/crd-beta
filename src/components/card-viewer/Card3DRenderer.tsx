
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { cardVertexShader, cardFragmentShader } from '@/shaders/cardShader';
import { glowVertexShader, glowFragmentShader } from '@/shaders/glowShader';
import { edgeVertexShader, edgeFragmentShader } from '@/shaders/edgeShader';

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
  const { gl, camera } = useThree();
  const [textureUrls, setTextureUrls] = useState({
    front: '',
    back: ''
  });
  
  // Fallback image to use if the card image is missing
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
  
  // Make sure we have valid texture URLs
  useEffect(() => {
    // Ensure we have valid image URLs before creating textures
    const frontUrl = card.imageUrl || fallbackImage;
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
    (loadedTextures) => {
      console.log('Card textures loaded successfully:', loadedTextures);
    }
  );
  
  // Set up shader materials
  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: cardVertexShader,
    fragmentShader: cardFragmentShader,
    uniforms: {
      frontTexture: { value: frontTexture },
      backTexture: { value: backTexture },
      isFlipped: { value: isFlipped },
      time: { value: 0 },
    },
    side: THREE.DoubleSide
  });
  
  // Glow effect material
  const glowColor = new THREE.Color(0.2, 0.8, 1.0);
  const glowMaterial = new THREE.ShaderMaterial({
    vertexShader: glowVertexShader,
    fragmentShader: glowFragmentShader,
    uniforms: {
      time: { value: 0 },
      glowColor: { value: glowColor }
    },
    transparent: true,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending
  });
  
  // Edge material
  const edgeMaterial = new THREE.ShaderMaterial({
    vertexShader: edgeVertexShader,
    fragmentShader: edgeFragmentShader,
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color(0.1, 0.1, 0.15) }
    },
    transparent: true,
    side: THREE.FrontSide
  });
  
  // Update uniforms on animation frame
  useFrame((state) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.time.value = state.clock.getElapsedTime();
      shaderMaterial.uniforms.isFlipped.value = isFlipped;
    }
    
    if (glowMaterial) {
      glowMaterial.uniforms.time.value = state.clock.getElapsedTime();
    }
    
    if (edgeMaterial) {
      edgeMaterial.uniforms.time.value = state.clock.getElapsedTime();
    }
    
    // Add subtle rotation animation
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <group>
      <mesh 
        ref={meshRef}
        rotation={[0, isFlipped ? Math.PI : 0, 0]}
      >
        {/* Card mesh */}
        <boxGeometry args={[3, 4, 0.05]} />
        <shaderMaterial 
          vertexShader={cardVertexShader}
          fragmentShader={cardFragmentShader}
          uniforms={{
            frontTexture: { value: frontTexture },
            backTexture: { value: backTexture },
            isFlipped: { value: isFlipped },
            time: { value: 0 }
          }}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Edge glow for effects */}
      <mesh 
        scale={[3.05, 4.05, 0.1]}
        position={[0, 0, -0.01]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial 
          vertexShader={glowVertexShader}
          fragmentShader={glowFragmentShader}
          uniforms={{
            time: { value: 0 },
            glowColor: { value: glowColor }
          }}
          transparent={true}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Card edges */}
      <mesh 
        scale={[3.05, 4.05, 0.15]}
        position={[0, 0, 0]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial 
          vertexShader={edgeVertexShader}
          fragmentShader={edgeFragmentShader}
          uniforms={{
            time: { value: 0 },
            baseColor: { value: new THREE.Color(0.1, 0.1, 0.15) }
          }}
          transparent={true}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
};

export default Card3DRenderer;
