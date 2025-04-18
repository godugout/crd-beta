
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useTexture } from '@react-three/drei';
import { DEFAULT_DESIGN_METADATA, FALLBACK_IMAGE_URL } from '@/lib/utils/cardDefaults';
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';

interface ImmersiveCardViewerProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
}

// Card 3D Model Component
const Card3DModel = ({ 
  frontTextureUrl, 
  backTextureUrl, 
  isFlipped,
  activeEffects,
  effectIntensities = {}
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Load textures
  const frontTexture = useTexture(frontTextureUrl);
  const backTexture = useTexture(backTextureUrl || '/card-back-texture.jpg');

  // Set PBR material properties
  const materialProps = {
    roughness: 0.2,
    metalness: 0.8,
    envMapIntensity: 1.2,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
    reflectivity: 0.5,
  };

  // Apply effect modifiers
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Apply effect-specific properties
    let modifiedProps: any = { ...materialProps };
    
    if (activeEffects.includes('Holographic')) {
      modifiedProps.metalness = 0.9;
      modifiedProps.clearcoat = 1.5;
      modifiedProps.clearcoatRoughness = 0.1;
      
      // These properties require THREE.MeshPhysicalMaterial
      if (meshRef.current.material instanceof THREE.MeshPhysicalMaterial) {
        meshRef.current.material.iridescence = 0.8;
        meshRef.current.material.iridescenceIOR = 1.4;
      }
    }
    
    if (activeEffects.includes('Shimmer')) {
      modifiedProps.metalness = 0.7;
      modifiedProps.roughness = 0.15;
      modifiedProps.envMapIntensity = 1.5;
    }
    
    if (activeEffects.includes('Refractor')) {
      // These properties require THREE.MeshPhysicalMaterial
      if (meshRef.current.material instanceof THREE.MeshPhysicalMaterial) {
        meshRef.current.material.transmission = 0.1;
        meshRef.current.material.thickness = 0.05;
      }
      modifiedProps.clearcoat = 1;
      modifiedProps.clearcoatRoughness = 0.1;
    }

    // Apply modifications to mesh material
    if (meshRef.current && meshRef.current.material) {
      Object.entries(modifiedProps).forEach(([key, value]) => {
        if (key in meshRef.current!.material) {
          (meshRef.current!.material as any)[key] = value;
        }
      });
    }
  }, [activeEffects, effectIntensities]);

  // Animation effect
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Card dimension ratios (2.5 x 3.5 inches standard card)
    const targetRotationY = isFlipped ? Math.PI : 0;
    const rotationSpeed = 0.1;
    
    // Animation for smooth flipping
    const animate = () => {
      if (!meshRef.current) return;
      
      // Smooth interpolation towards target rotation
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * rotationSpeed;
      
      // Add subtle floating animation
      if (!isFlipped) {
        const time = Date.now() * 0.001;
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.05;
        meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.02;
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isFlipped]);

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Card geometry with proper card proportions (2.5 x 3.5 inch standard) */}
      <planeGeometry args={[2.5, 3.5, 20, 20]} />
      
      {/* Front material */}
      <meshPhysicalMaterial 
        map={frontTexture} 
        side={THREE.FrontSide} 
        {...materialProps} 
      />
      
      {/* Back material (added as a separate mesh to avoid material issues) */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.5, 3.5, 1, 1]} />
        <meshPhysicalMaterial 
          map={backTexture} 
          side={THREE.FrontSide} 
          {...materialProps} 
        />
      </mesh>
    </mesh>
  );
};

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [processedCard, setProcessedCard] = useState<Card>(card);
  const [isLoading, setIsLoading] = useState(true);
  const [frontTexture, setFrontTexture] = useState<string>(card?.imageUrl || FALLBACK_IMAGE_URL);
  const [backTexture, setBackTexture] = useState<string>('/card-back-texture.jpg');
  
  // Ensure we have valid image URLs before rendering
  useEffect(() => {
    const validateCardImages = async () => {
      setIsLoading(true);
      
      // Create a deep copy of the card to avoid mutating the original
      const cardCopy: Card = JSON.parse(JSON.stringify(card));
      
      // Ensure designMetadata is always present with required fields
      if (!cardCopy.designMetadata || !cardCopy.designMetadata.cardStyle) {
        console.warn(`Card ${cardCopy.id} is missing designMetadata or cardStyle, using default values`);
        cardCopy.designMetadata = DEFAULT_DESIGN_METADATA;
      }
      
      // Check if card has valid image URL
      if (!cardCopy.imageUrl || cardCopy.imageUrl === 'undefined') {
        console.warn(`Card ${cardCopy.id} is missing an image URL, using fallback`);
        cardCopy.imageUrl = FALLBACK_IMAGE_URL;
        
        toast({
          title: "Using fallback image",
          description: "The original card image couldn't be loaded",
          variant: "default",
          duration: 3000
        });
      }
      
      // Also ensure we have a thumbnail URL
      if (!cardCopy.thumbnailUrl || cardCopy.thumbnailUrl === 'undefined') {
        cardCopy.thumbnailUrl = cardCopy.imageUrl || FALLBACK_IMAGE_URL;
      }
      
      // Ensure other required fields are present
      if (!cardCopy.effects) {
        cardCopy.effects = [];
      }
      
      // Set up imagePreload to validate that images actually load
      try {
        const image = new Image();
        image.onload = () => {
          console.log(`Image loaded successfully: ${cardCopy.imageUrl}`);
          setFrontTexture(cardCopy.imageUrl);
          setProcessedCard(cardCopy);
          setIsLoading(false);
        };
        image.onerror = () => {
          console.error(`Failed to load image: ${cardCopy.imageUrl}, using fallback`);
          cardCopy.imageUrl = FALLBACK_IMAGE_URL;
          cardCopy.thumbnailUrl = FALLBACK_IMAGE_URL;
          setFrontTexture(FALLBACK_IMAGE_URL);
          setProcessedCard(cardCopy);
          setIsLoading(false);
        };
        image.src = cardCopy.imageUrl;
      } catch (error) {
        console.error("Error during image validation:", error);
        cardCopy.imageUrl = FALLBACK_IMAGE_URL;
        cardCopy.thumbnailUrl = FALLBACK_IMAGE_URL;
        setFrontTexture(FALLBACK_IMAGE_URL);
        setProcessedCard(cardCopy);
        setIsLoading(false);
      }
    };
    
    validateCardImages();
  }, [card, toast]);
  
  if (isLoading) {
    return (
      <div 
        className="w-full h-full min-h-[600px] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center"
      >
        <div className="text-white text-center">
          <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Preparing immersive card viewer...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[600px] bg-gray-900 rounded-lg overflow-hidden"
    >
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={1.5} 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} color="#2020ff" intensity={0.5} />
        
        {/* Environment for reflections */}
        <Environment preset="city" />
        
        {/* Card model */}
        <Card3DModel 
          frontTextureUrl={frontTexture}
          backTextureUrl={backTexture}
          isFlipped={isFlipped}
          activeEffects={activeEffects}
          effectIntensities={effectIntensities}
        />
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default ImmersiveCardViewer;
