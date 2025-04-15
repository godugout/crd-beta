import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Card } from '@/lib/types';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { toast } from 'sonner';
import CardDiagnostics from './CardDiagnostics';

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
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [lastScrollTime, setLastScrollTime] = useState(0);
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

  const [frontTexture, backTexture] = useTexture(
    [frontTexturePath, backTexturePath],
    (textures) => {
      console.log('Textures loaded successfully:', textures);
      setRenderingStats(prev => ({
        ...prev,
        imageLoaded: true,
        warnings: prev.warnings.filter(w => !w.includes('texture loading'))
      }));
    }
  );

  // Handle scroll events for card spinning
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      const timeDiff = now - lastScrollTime;
      
      // Limit how often we update rotation speed
      if (timeDiff > 50) {
        const newSpeed = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.01, 0.5);
        setRotationSpeed(prev => prev + newSpeed);
        setLastScrollTime(now);
      }
    };

    const container = gl.domElement.parentElement;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [gl, lastScrollTime]);

  // Create metallic shader for card back
  const cardShader = useMemo(() => ({
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D frontTexture;
      uniform sampler2D backTexture;
      uniform bool isFlipped;
      uniform float time;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vec4 texColor;
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Calculate metallic reflection
        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);
        vec3 metalColor = vec3(0.7, 0.7, 0.8); // Slight blue-ish silver
        
        if (isFlipped) {
          // Back of card - metallic effect
          vec4 backTex = texture2D(backTexture, vUv);
          float etching = 1.0 - (backTex.r + backTex.g + backTex.b) / 3.0;
          
          // Create metallic surface with etched details
          vec3 baseMetallic = mix(metalColor * 0.6, metalColor, fresnel);
          vec3 etchedColor = mix(baseMetallic * 0.3, baseMetallic, etching);
          
          // Add subtle light movement
          float lightIntensity = sin(time * 2.0 + vUv.x * 10.0) * 0.1 + 0.9;
          texColor = vec4(etchedColor * lightIntensity, 1.0);
        } else {
          // Front of card - regular texture
          texColor = texture2D(frontTexture, vUv);
        }
        
        gl_FragColor = texColor;
      }
    `
  }), []);

  // Update card rotation based on scroll speed
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Apply rotation from scroll/swipe
      meshRef.current.rotation.y += rotationSpeed * delta;
      
      // Apply damping to slow down rotation
      setRotationSpeed(prev => prev * 0.95);
      
      // Update shader uniforms
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
        materialRef.current.uniforms.isFlipped.value = isFlipped;
      }
    }
  });

  // Create shader material with uniforms
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: cardShader.vertexShader,
      fragmentShader: cardShader.fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        frontTexture: { value: frontTexture },
        backTexture: { value: backTexture },
        isFlipped: { value: isFlipped },
        time: { value: 0 }
      }
    });
  }, [cardShader, frontTexture, backTexture, isFlipped]);

  // Card dimensions with proper aspect ratio (2.5 x 3.5)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.05; // Subtle thickness for 3D effect

  return (
    <>
      <mesh 
        ref={meshRef}
        rotation={[0, isFlipped ? Math.PI : 0, 0]}
      >
        <boxGeometry args={[2.5, 3.5, 0.05]} />
        <primitive 
          object={shaderMaterial} 
          ref={materialRef}
          attach="material"
        />
        
        {/* Add subtle edge highlight */}
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(2.5, 3.5, 0.05)]} />
          <lineBasicMaterial attach="material" color="#ffffff" transparent opacity={0.2} />
        </lineSegments>
      </mesh>
      
      {/* Diagnostics panel */}
      <CardDiagnostics
        card={card}
        isVisible={showDiagnostics}
        renderingStats={renderingStats}
      />
    </>
  );
};

export default Card3DRenderer;
