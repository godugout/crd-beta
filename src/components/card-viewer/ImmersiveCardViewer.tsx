import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, shaderMaterial } from '@react-three/drei';
import { DEFAULT_DESIGN_METADATA, FALLBACK_IMAGE_URL } from '@/lib/utils/cardDefaults';
import { useToast } from '@/hooks/use-toast';
import * as THREE from 'three';
import { logRenderingInfo } from '@/utils/debugRenderer';

interface ImmersiveCardViewerProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
}

// Holographic shader material
const HolographicMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uIntensity: 1.0,
    uMouse: new THREE.Vector2(0.5, 0.5),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float uIntensity;
    uniform vec2 uMouse;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    vec3 rainbow(float t) {
      vec3 c = vec3(0.5, 0.5, 0.5) + vec3(0.5, 0.5, 0.5) * cos(6.28318 * (vec3(1.0, 1.0, 1.0) * t + vec3(0.0, 0.33, 0.67)));
      return c;
    }
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Create holographic effect based on viewing angle
      float angle = dot(vNormal, vec3(0.0, 0.0, 1.0));
      float fresnel = pow(1.0 - angle, 2.0);
      
      // Rainbow interference pattern
      float interference = sin(vUv.x * 50.0 + uTime * 2.0) * sin(vUv.y * 30.0 + uTime * 1.5);
      interference = (interference + 1.0) * 0.5;
      
      vec3 hologramColor = rainbow(interference + uTime * 0.1);
      
      // Mix base texture with holographic effect
      vec3 finalColor = mix(texColor.rgb, hologramColor, fresnel * uIntensity * 0.6);
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `
);

// Shimmer shader material
const ShimmerMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uIntensity: 1.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float uIntensity;
    
    varying vec2 vUv;
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Create shimmer effect
      float shimmer = sin(vUv.x * 10.0 + uTime * 4.0) * sin(vUv.y * 8.0 + uTime * 3.0);
      shimmer = (shimmer + 1.0) * 0.5;
      
      vec3 shimmerColor = vec3(1.0, 1.0, 1.0) * shimmer * uIntensity * 0.3;
      
      vec3 finalColor = texColor.rgb + shimmerColor;
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `
);

// Refractor shader material
const RefractorMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uIntensity: 1.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float uIntensity;
    
    varying vec2 vUv;
    
    void main() {
      // Create refraction distortion
      vec2 distortion = vec2(
        sin(vUv.y * 20.0 + uTime) * 0.01,
        cos(vUv.x * 15.0 + uTime * 1.5) * 0.01
      ) * uIntensity;
      
      vec2 distortedUV = vUv + distortion;
      vec4 texColor = texture2D(uTexture, distortedUV);
      
      // Add prismatic color separation
      float r = texture2D(uTexture, distortedUV + vec2(0.002, 0.0) * uIntensity).r;
      float g = texture2D(uTexture, distortedUV).g;
      float b = texture2D(uTexture, distortedUV - vec2(0.002, 0.0) * uIntensity).b;
      
      gl_FragColor = vec4(r, g, b, texColor.a);
    }
  `
);

// Vintage shader material
const VintageMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uIntensity: 1.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float uIntensity;
    
    varying vec2 vUv;
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Sepia tone
      float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      vec3 sepia = vec3(gray) * vec3(1.2, 1.0, 0.8);
      
      // Add noise and aging
      float noise = fract(sin(dot(vUv * 1000.0, vec2(12.9898, 78.233))) * 43758.5453);
      vec3 aged = sepia * (0.9 + noise * 0.1);
      
      // Vignette effect
      float vignette = distance(vUv, vec2(0.5)) * 2.0;
      vignette = 1.0 - smoothstep(0.5, 1.5, vignette);
      
      vec3 finalColor = mix(texColor.rgb, aged * vignette, uIntensity);
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `
);

// Extend the materials so they can be used in JSX
extend({ 
  HolographicMaterial: HolographicMaterial,
  ShimmerMaterial: ShimmerMaterial,
  RefractorMaterial: RefractorMaterial,
  VintageMaterial: VintageMaterial
});

// Type declarations for the custom materials
declare global {
  namespace JSX {
    interface IntrinsicElements {
      holographicMaterial: any;
      shimmerMaterial: any;
      refractorMaterial: any;
      vintageMaterial: any;
    }
  }
}

const Card3DModel = ({ 
  frontTextureUrl, 
  backTextureUrl, 
  isFlipped,
  activeEffects,
  effectIntensities = {}
}: {
  frontTextureUrl: string;
  backTextureUrl: string;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);
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
      undefined,
      (error) => {
        console.error("Error loading back texture:", error);
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
  }, [frontTextureUrl, backTextureUrl, defaultCardBackImage]);
  
  useEffect(() => {
    if (frontTextureLoaded && backTextureLoaded) {
      console.log("Both textures loaded successfully");
      setTexturesLoaded(true);
    }
  }, [frontTextureLoaded, backTextureLoaded]);

  // Determine which material to use based on active effects
  const materialType = useMemo(() => {
    if (activeEffects.includes('Holographic')) return 'holographic';
    if (activeEffects.includes('Shimmer')) return 'shimmer';
    if (activeEffects.includes('Refractor')) return 'refractor';
    if (activeEffects.includes('Vintage')) return 'vintage';
    return 'standard';
  }, [activeEffects]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const targetRotationY = isFlipped ? Math.PI : 0;
    
    if (groupRef.current.rotation.y !== targetRotationY) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1;
    }
    
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.02;
    
    if (hovered) {
      groupRef.current.position.y += 0.1;
    }
    
    // Update shader uniforms
    if (materialRef.current && materialRef.current.uniforms) {
      materialRef.current.uniforms.uTime.value = time;
      if (materialRef.current.uniforms.uIntensity) {
        const intensity = effectIntensities[activeEffects[0]] || 1.0;
        materialRef.current.uniforms.uIntensity.value = intensity;
      }
    }
    
    logRenderingInfo("Card3DModel", {
      visible: texturesLoaded,
      position: {
        y: groupRef.current.position.y,
        z: groupRef.current.position.z
      }
    });
  });

  const renderMaterial = () => {
    if (!frontTextureLoaded) return null;
    
    const commonProps = {
      ref: materialRef,
      side: THREE.FrontSide,
    };
    
    switch (materialType) {
      case 'holographic':
        return (
          <holographicMaterial 
            {...commonProps}
            uTexture={frontTextureLoaded}
            uIntensity={effectIntensities.Holographic || 1.0}
            transparent
          />
        );
      case 'shimmer':
        return (
          <shimmerMaterial 
            {...commonProps}
            uTexture={frontTextureLoaded}
            uIntensity={effectIntensities.Shimmer || 1.0}
          />
        );
      case 'refractor':
        return (
          <refractorMaterial 
            {...commonProps}
            uTexture={frontTextureLoaded}
            uIntensity={effectIntensities.Refractor || 1.0}
          />
        );
      case 'vintage':
        return (
          <vintageMaterial 
            {...commonProps}
            uTexture={frontTextureLoaded}
            uIntensity={effectIntensities.Vintage || 1.0}
          />
        );
      default:
        return (
          <meshPhysicalMaterial 
            {...commonProps}
            map={frontTextureLoaded}
            roughness={0.2}
            metalness={0.8}
            envMapIntensity={1.5}
            clearcoat={1}
            clearcoatRoughness={0.2}
            reflectivity={0.8}
          />
        );
    }
  };

  if (!texturesLoaded) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    );
  }

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
        {renderMaterial()}
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
        />
      </Canvas>
      
      <div className="absolute top-0 left-0 right-0 p-2 text-white text-xs bg-black/30 pointer-events-none">
        3D Viewer: {processedCard.id} - {processedCard.title || 'Untitled Card'} | Active Effects: {activeEffects.join(', ') || 'None'}
      </div>
    </div>
  );
};

export default ImmersiveCardViewer;
