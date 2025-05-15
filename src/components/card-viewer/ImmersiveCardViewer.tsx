import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { DEFAULT_DESIGN_METADATA, FALLBACK_IMAGE_URL } from '@/lib/utils/cardDefaults';
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';
import { logRenderingInfo } from '@/utils/debugRenderer';

interface ImmersiveCardViewerProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
  isAutoRotating?: boolean; // Added this prop
}

const Card3DModel = ({ 
  frontTextureUrl, 
  backTextureUrl, 
  isFlipped,
  activeEffects,
  effectIntensities = {},
  isAutoRotating = false // Added default value
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [frontTextureLoaded, setFrontTextureLoaded] = useState<THREE.Texture | null>(null);
  const [backTextureLoaded, setBackTextureLoaded] = useState<THREE.Texture | null>(null);
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  
  const defaultCardBackImage = '/images/card-back-placeholder.png';
  
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    
    console.log("Loading front texture from:", frontTextureUrl);
    
    textureLoader.load(
      frontTextureUrl,
      (texture) => {
        console.log("Front texture loaded successfully");
        setFrontTextureLoaded(texture);
      },
      (xhr) => {
        console.log("Front texture loading progress:", (xhr.loaded / xhr.total) * 100 + "%");
      },
      (error) => {
        console.error("Error loading front texture:", error);
        textureLoader.load(
          FALLBACK_IMAGE_URL,
          (fallbackTexture) => {
            console.log("Fallback front texture loaded");
            setFrontTextureLoaded(fallbackTexture);
          },
          undefined,
          () => console.error("Even fallback image failed to load")
        );
      }
    );
    
    console.log("Loading back texture from:", backTextureUrl || defaultCardBackImage);
    textureLoader.load(
      backTextureUrl || defaultCardBackImage,
      (texture) => {
        console.log("Back texture loaded successfully");
        setBackTextureLoaded(texture);
      },
      (xhr) => {
        console.log("Back texture loading progress:", (xhr.loaded / xhr.total) * 100 + "%");
      },
      (error) => {
        console.error("Error loading back texture:", error);
        const absoluteBackUrl = new URL(defaultCardBackImage, window.location.origin).href;
        console.log("Trying absolute URL for back texture:", absoluteBackUrl);
        
        textureLoader.load(
          absoluteBackUrl,
          (fallbackTexture) => {
            console.log("Default back texture loaded from absolute URL");
            setBackTextureLoaded(fallbackTexture);
          },
          undefined,
          () => {
            console.error("Failed to load default card back");
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#2a3042';
              ctx.fillRect(0, 0, 512, 512);
              const plainTexture = new THREE.CanvasTexture(canvas);
              setBackTextureLoaded(plainTexture);
              console.log("Created plain color texture as fallback");
            }
          }
        );
      }
    );
  }, [frontTextureUrl, backTextureUrl, defaultCardBackImage]);
  
  useEffect(() => {
    if (frontTextureLoaded && backTextureLoaded) {
      console.log("Both textures loaded successfully");
      setTexturesLoaded(true);
    }
  }, [frontTextureLoaded, backTextureLoaded]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const targetRotationY = isFlipped ? Math.PI : 0;
    
    if (groupRef.current.rotation.y !== targetRotationY) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1;
    }
    
    const time = state.clock.getElapsedTime();
    
    // Apply auto-rotation if enabled
    if (isAutoRotating) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.02;
    
    if (hovered) {
      groupRef.current.position.y += 0.1;
    }
    
    logRenderingInfo("Card3DModel", {
      visible: texturesLoaded,
      position: {
        y: groupRef.current.position.y,
        z: groupRef.current.position.z
      }
    });
  });

  if (!texturesLoaded) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    );
  }

  const createGlowMaterial = () => {
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8050ff'),
      emissive: new THREE.Color('#4020a0'),
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.6
    });
    return glowMaterial;
  };

  return (
    <group 
      ref={groupRef}
      position={[0, 0, 0]}
      rotation={[0.1, 0, 0]}
    >
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[2.5, 3.5, 20, 20]} />
        <meshPhysicalMaterial 
          map={frontTextureLoaded}
          side={THREE.FrontSide}
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.2}
          reflectivity={0.8}
        />
      </mesh>
      
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.5, 3.5, 1, 1]} />
        <meshPhysicalMaterial 
          map={backTextureLoaded}
          side={THREE.FrontSide}
          roughness={0.3}
          metalness={0.7}
          envMapIntensity={1.2}
          clearcoat={0.8}
        />
      </mesh>
      
      {activeEffects.includes('Holographic') && (
        <mesh position={[0, 0, -0.03]} scale={[2.55, 3.55, 1]}>
          <planeGeometry args={[1, 1]} />
          <primitive object={createGlowMaterial()} attach="material" />
        </mesh>
      )}
    </group>
  );
};

const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities = {},
  isAutoRotating = false // Added with default value
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [processedCard, setProcessedCard] = useState<Card>(card);
  const [isLoading, setIsLoading] = useState(true);
  const [frontTexture, setFrontTexture] = useState<string>(card?.imageUrl || FALLBACK_IMAGE_URL);
  const [backTexture, setBackTexture] = useState<string>('/images/card-back-placeholder.png');
  
  useEffect(() => {
    const validateCardImages = async () => {
      setIsLoading(true);
      
      const cardCopy: Card = JSON.parse(JSON.stringify(card));
      
      if (!cardCopy.designMetadata || !cardCopy.designMetadata.cardStyle) {
        console.warn(`Card ${cardCopy.id} is missing designMetadata or cardStyle, using default values`);
        cardCopy.designMetadata = DEFAULT_DESIGN_METADATA;
      }
      
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
      
      if (!cardCopy.thumbnailUrl || cardCopy.thumbnailUrl === 'undefined') {
        cardCopy.thumbnailUrl = cardCopy.imageUrl || FALLBACK_IMAGE_URL;
      }
      
      if (!cardCopy.effects) {
        cardCopy.effects = [];
      }
      
      try {
        const image = new Image();
        image.crossOrigin = "anonymous";
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
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        
        <ambientLight intensity={1.0} />
        <spotLight 
          position={[5, 5, 5]} 
          angle={0.4} 
          penumbra={1} 
          intensity={2.0} 
          castShadow 
        />
        <pointLight position={[-5, -5, -5]} color="#3050ff" intensity={1.0} />
        <pointLight position={[5, -3, -5]} color="#ff3050" intensity={0.8} />
        
        <Environment preset="city" background={true} />
        
        <Card3DModel 
          frontTextureUrl={frontTexture}
          backTextureUrl={backTexture}
          isFlipped={isFlipped}
          activeEffects={activeEffects}
          effectIntensities={effectIntensities}
          isAutoRotating={isAutoRotating} // Pass the prop through
        />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={4}
          maxDistance={10}
          target={[0, 0, 0]}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI * 5/6}
          autoRotate={isAutoRotating} // Use the prop for OrbitControls
          autoRotateSpeed={2.0}
        />
      </Canvas>
      
      <div className="absolute top-0 left-0 right-0 p-2 text-white text-xs bg-black/30 pointer-events-none">
        3D Viewer: {processedCard.id} - {processedCard.title || 'Untitled Card'}
      </div>
    </div>
  );
};

export default ImmersiveCardViewer;
