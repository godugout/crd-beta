import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { DEFAULT_DESIGN_METADATA, FALLBACK_IMAGE_URL } from '@/lib/utils/cardDefaults';
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface ImmersiveCardViewerProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
}

const Card3DModel = ({ 
  frontTextureUrl, 
  backTextureUrl, 
  isFlipped,
  activeEffects,
  effectIntensities = {}
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [frontTextureLoaded, setFrontTextureLoaded] = useState<THREE.Texture | null>(null);
  const [backTextureLoaded, setBackTextureLoaded] = useState<THREE.Texture | null>(null);
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  
  // Default card back image - using a relative path that exists in the public folder
  const defaultCardBackImage = '/images/card-back-placeholder.png';
  
  // Load textures safely with error handling
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    
    // Load front texture
    textureLoader.load(
      frontTextureUrl,
      (texture) => {
        setFrontTextureLoaded(texture);
        console.log("Front texture loaded successfully");
      },
      undefined,
      (error) => {
        console.error("Error loading front texture:", error);
        // Load fallback texture for front
        textureLoader.load(
          FALLBACK_IMAGE_URL,
          (fallbackTexture) => setFrontTextureLoaded(fallbackTexture),
          undefined,
          () => console.error("Even fallback image failed to load")
        );
      }
    );
    
    // Load back texture
    textureLoader.load(
      backTextureUrl || defaultCardBackImage,
      (texture) => {
        setBackTextureLoaded(texture);
        console.log("Back texture loaded successfully");
      },
      undefined,
      (error) => {
        console.error("Error loading back texture:", error);
        // Load default card back
        textureLoader.load(
          defaultCardBackImage,
          (fallbackTexture) => setBackTextureLoaded(fallbackTexture),
          undefined,
          () => console.error("Failed to load default card back")
        );
      }
    );
  }, [frontTextureUrl, backTextureUrl, defaultCardBackImage]);
  
  // Set textures loaded when both are available
  useEffect(() => {
    if (frontTextureLoaded && backTextureLoaded) {
      setTexturesLoaded(true);
    }
  }, [frontTextureLoaded, backTextureLoaded]);

  // Animation effect
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Card dimension ratios (2.5 x 3.5 inches standard card)
    const targetRotationY = isFlipped ? Math.PI : 0;
    
    // Smooth rotation for flipping
    if (groupRef.current.rotation.y !== targetRotationY) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1;
    }
    
    // Add floating animation
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.1; // Gentle floating
    groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.02; // Subtle tilting
    
    // Add hover effect
    if (hovered) {
      groupRef.current.position.y += 0.1;
    }
  });

  if (!texturesLoaded) {
    return null;
  }

  return (
    <group 
      ref={groupRef}
      position={[0, 0, 0]}
      rotation={[0.1, 0, 0]} // Slight initial tilt
    >
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Card geometry */}
        <planeGeometry args={[2.5, 3.5, 20, 20]} />
        
        {/* Front material */}
        <meshPhysicalMaterial 
          map={frontTextureLoaded}
          side={THREE.FrontSide}
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={1.2}
          clearcoat={1}
          clearcoatRoughness={0.2}
          reflectivity={0.5}
        />
      </mesh>
      
      {/* Back face */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.5, 3.5, 1, 1]} />
        <meshPhysicalMaterial 
          map={backTextureLoaded}
          side={THREE.FrontSide}
          roughness={0.3}
          metalness={0.7}
          envMapIntensity={1}
          clearcoat={0.8}
        />
      </mesh>
    </group>
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
  const [backTexture, setBackTexture] = useState<string>('/images/card-back-placeholder.png');
  
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
        {/* Camera positioned for better view */}
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[5, 5, 5]} 
          angle={0.4} 
          penumbra={1} 
          intensity={1.2} 
          castShadow 
        />
        <pointLight position={[-5, -5, -5]} color="#3050ff" intensity={0.5} />
        <pointLight position={[5, -3, -5]} color="#ff3050" intensity={0.3} />
        
        {/* Environment and effects */}
        <Environment preset="city" />
        <EffectComposer>
          <Bloom intensity={0.5} radius={0.7} />
        </EffectComposer>
        
        <Card3DModel 
          frontTextureUrl={frontTexture}
          backTextureUrl={backTexture}
          isFlipped={isFlipped}
          activeEffects={activeEffects}
          effectIntensities={effectIntensities}
        />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={4}
          maxDistance={10}
          target={[0, 0, 0]}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI * 3/4}
        />
      </Canvas>
    </div>
  );
};

export default ImmersiveCardViewer;
