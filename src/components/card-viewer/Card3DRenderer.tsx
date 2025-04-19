import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

interface Card3DRendererProps {
  card: Card;
  className?: string;
  isFlipped?: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
}

// Helper function to map our custom lighting presets to valid @react-three/drei environment presets
const mapToValidEnvironmentPreset = (
  preset: string
): "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse" => {
  const validPresetMap = {
    studio: "studio",
    natural: "park",
    dramatic: "night", 
    display_case: "lobby"
  } as const;
  
  return (validPresetMap[preset as keyof typeof validPresetMap] || "studio") as 
    "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse";
};

const Card3DRenderer: React.FC<Card3DRendererProps> = ({ 
  card, 
  isFlipped = false,
  activeEffects = [],
  effectIntensities = {}
}) => {
  const cardRef = useRef<THREE.Group>(null);
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);
  const [textureLoading, setTextureLoading] = useState(true);
  const [textureError, setTextureError] = useState(false);
  
  // Load textures on component mount
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    setTextureLoading(true);
    setTextureError(false);
    
    // Load front texture
    textureLoader.load(
      card.imageUrl || '/placeholder-card.png',
      (texture) => {
        console.log("Front texture loaded successfully");
        setFrontTexture(texture);
        setTextureLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading front texture:', error);
        setTextureError(true);
        setTextureLoading(false);
      }
    );
    
    // Load back texture
    textureLoader.load(
      '/card-back-texture.jpg',
      (texture) => {
        console.log("Back texture loaded successfully");
        setBackTexture(texture);
      },
      undefined,
      (error) => {
        console.error('Error loading back texture:', error);
      }
    );
    
    return () => {
      // Cleanup textures
      if (frontTexture) frontTexture.dispose();
      if (backTexture) backTexture.dispose();
    };
  }, [card.imageUrl]);

  // Update the default card material to have a more realistic matte printing appearance
  const createDefaultMaterial = (texture: THREE.Texture | null, isBack: boolean = false) => {
    return new THREE.MeshPhysicalMaterial({
      map: texture,
      color: texture ? undefined : (isBack ? "#1a3060" : "#2a5298"),
      metalness: 0.1,      // Lower metalness for matte look
      roughness: 0.7,      // Higher roughness for matte finish
      clearcoat: 0.3,      // Subtle clearcoat for print finish
      clearcoatRoughness: 0.8,  // High roughness in clearcoat
      envMapIntensity: 0.5,     // Subtle environment reflections
      flatShading: false,
      normalScale: new THREE.Vector2(0.05, 0.05)  // Subtle normal mapping for paper texture
    });
  };

  // Enhanced holographic effect with geometric patterns and rainbow gradients
  const createHolographicMaterial = (intensity: number = 1.0) => {
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 0.95,
      roughness: 0.15,
      transmission: 0.1,
      thickness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.15 * intensity,
      side: THREE.FrontSide,
      envMapIntensity: 2.5
    });

    // Add rainbow gradient through custom shader chunks
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        float rainbow = sin(vUv.x * 10.0 + time * 0.5) * 0.5 + 0.5;
        vec3 rainbowColor = vec3(
          sin(rainbow + 0.0) * 0.5 + 0.5,
          sin(rainbow + 2.094) * 0.5 + 0.5,
          sin(rainbow + 4.188) * 0.5 + 0.5
        );
        diffuseColor.rgb = mix(diffuseColor.rgb, rainbowColor, 0.3);
        
        // Add subtle geometric pattern
        float pattern = step(0.5, fract(vUv.x * 20.0)) * step(0.5, fract(vUv.y * 20.0));
        diffuseColor.rgb += pattern * 0.1;
        `
      );
    };

    return material;
  };

  // Enhanced shimmer effect with glossy finish
  const createShimmerMaterial = (intensity: number = 1.0) => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.2 * intensity,
      envMapIntensity: 3.0
    });
  };

  // Improved refractor effect with full card coverage
  const createRefractorMaterial = (intensity: number = 1.0) => {
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 0.95,
      roughness: 0.05,
      transmission: 0.5,
      thickness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.3 * intensity,
      envMapIntensity: 2.5,
      side: THREE.DoubleSide
    });

    // Add prismatic refraction through custom shader
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        float refraction = sin(vUv.x * 15.0 + vUv.y * 15.0 + time) * 0.5 + 0.5;
        vec3 prismColor = vec3(
          sin(refraction * 6.28318) * 0.5 + 0.5,
          sin(refraction * 6.28318 + 2.094) * 0.5 + 0.5,
          sin(refraction * 6.28318 + 4.188) * 0.5 + 0.5
        );
        diffuseColor.rgb = mix(diffuseColor.rgb, prismColor, 0.4);
        `
      );
    };

    return material;
  };

  // Enhanced vintage effect with sepia tone and print artifacts
  const createVintageMaterial = (texture: THREE.Texture | null) => {
    const material = new THREE.MeshPhysicalMaterial({
      map: texture,
      color: new THREE.Color(0xd4b886),  // Sepia base tone
      metalness: 0.1,
      roughness: 0.8,
      clearcoat: 0.2,
      clearcoatRoughness: 0.9
    });

    // Add vintage processing effects through custom shader
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        // Sepia tone
        vec3 sepiaColor = vec3(
          diffuseColor.r * 0.393 + diffuseColor.g * 0.769 + diffuseColor.b * 0.189,
          diffuseColor.r * 0.349 + diffuseColor.g * 0.686 + diffuseColor.b * 0.168,
          diffuseColor.r * 0.272 + diffuseColor.g * 0.534 + diffuseColor.b * 0.131
        );
        
        // Add subtle print dots pattern
        float dotPattern = step(0.5, fract(vUv.x * 100.0)) * step(0.5, fract(vUv.y * 100.0));
        
        // Add slight vignette
        vec2 center = vUv - 0.5;
        float vignette = 1.0 - dot(center, center) * 0.5;
        
        // Combine effects
        diffuseColor.rgb = mix(diffuseColor.rgb, sepiaColor, 0.8) * (0.8 + dotPattern * 0.2) * vignette;
        `
      );
    };

    return material;
  };

  useFrame((state) => {
    if (!cardRef.current) return;
    
    const targetRotation = isFlipped ? Math.PI : 0;
    cardRef.current.rotation.y = THREE.MathUtils.lerp(
      cardRef.current.rotation.y,
      targetRotation,
      0.1
    );

    // Subtle floating animation
    const t = state.clock.getElapsedTime();
    cardRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    cardRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
    
    // Update holographic effect if active
    if (activeEffects.includes('Holographic')) {
      cardRef.current.children.forEach(child => {
        if (child.userData.effectType === 'holographic' && child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshPhysicalMaterial) {
            const intensity = effectIntensities['Holographic'] || 1.0;
            const time = state.clock.getElapsedTime();
            
            // Create more subtle color shifts
            const hue = ((Math.sin(time * 0.2) * 0.1) + 0.5) % 1.0;
            const color = new THREE.Color();
            color.setHSL(hue, 0.5, 0.6);
            
            // Apply subtle modifications
            child.material.color = color;
            child.material.emissive = color.clone().multiplyScalar(0.2);
            child.material.emissiveIntensity = 0.1 + Math.sin(time * 1.5) * 0.05;
            child.material.opacity = 0.15 * intensity * (0.8 + Math.sin(time * 0.5) * 0.2);
            
            // Create subtle wave pattern
            if (child.geometry instanceof THREE.PlaneGeometry) {
              const positions = child.geometry.attributes.position;
              for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const waveX = Math.sin(x * 3 + time * 0.5) * 0.002 * intensity;
                const waveY = Math.cos(y * 3 + time * 0.5) * 0.002 * intensity;
                positions.setZ(i, waveX + waveY);
              }
              positions.needsUpdate = true;
            }
          }
        }
      });
    }
  });

  // If there's a texture error, show an error cube
  if (textureError) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  // Show loading state while textures load
  if (textureLoading) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshStandardMaterial color="#2a5298" wireframe />
      </mesh>
    );
  }

  // Get effect intensity value for a specific effect
  const getEffectIntensity = (effectName: string) => {
    return effectIntensities[effectName] || 1.0;
  };

  // If no environment type is specified, fallback to 'studio'
  const getEnvironmentPreset = (): "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse" => {
    // Extract environmentType from card if it exists, otherwise use 'studio'
    const environmentType = (card as any).environmentType || 'studio';
    
    // Map to a valid preset that @react-three/drei supports
    return mapToValidEnvironmentPreset(environmentType);
  };

  return (
    <group ref={cardRef}>
      <Environment 
        preset={getEnvironmentPreset()} 
        background={false} 
      />
      
      {/* Card mesh with improved materials */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[2.5, 3.5, 32, 32]} />
        <primitive object={activeEffects.includes('Vintage') ? 
          createVintageMaterial(frontTexture) : 
          createDefaultMaterial(frontTexture)} 
          attach="material" 
        />
      </mesh>

      {/* Apply special effects layers */}
      {activeEffects.includes('Holographic') && (
        <mesh position={[0, 0, 0.01]} userData={{ effectType: 'holographic' }}>
          <planeGeometry args={[2.48, 3.48, 32, 32]} />
          <primitive object={createHolographicMaterial(effectIntensities['Holographic'])} attach="material" />
        </mesh>
      )}
      
      {activeEffects.includes('Shimmer') && (
        <mesh position={[0, 0, 0.015]} userData={{ effectType: 'shimmer' }}>
          <planeGeometry args={[2.46, 3.46, 32, 32]} />
          <primitive object={createShimmerMaterial(effectIntensities['Shimmer'])} attach="material" />
        </mesh>
      )}

      {activeEffects.includes('Refractor') && (
        <mesh position={[0, 0, 0.02]} userData={{ effectType: 'refractor' }}>
          <planeGeometry args={[2.5, 3.5, 32, 32]} />
          <primitive object={createRefractorMaterial(effectIntensities['Refractor'])} attach="material" />
        </mesh>
      )}
      
      {/* Card back with appropriate material */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5, 32, 32]} />
        <primitive object={createDefaultMaterial(backTexture, true)} attach="material" />
      </mesh>
    </group>
  );
};

export default Card3DRenderer;
