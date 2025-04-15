
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Card } from '@/lib/types';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
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
  
  // Load textures with error handling
  const [frontTexture, backTexture] = useTexture(
    [frontTexturePath, backTexturePath],
    (textures) => {
      console.log('Textures loaded successfully:', textures);
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
      toast.error('Failed to load card textures');
    }
  );
  
  // Update diagnostics for effect changes
  useEffect(() => {
    setRenderingStats(prev => ({
      ...prev,
      effectsApplied: activeEffects
    }));
  }, [activeEffects]);

  // Handle keyboard shortcut for diagnostics toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setShowDiagnostics(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Create card shader with effects support
  const cardShader = useMemo(() => {
    return {
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D frontTexture;
        uniform sampler2D backTexture;
        uniform float flipProgress;
        uniform float time;
        uniform bool isFlipped;
        uniform bool hasHolographic;
        uniform bool hasRefractor;
        uniform bool hasChrome;
        uniform bool hasVintage;
        uniform float holographicIntensity;
        uniform float refractorIntensity;
        uniform float chromeIntensity;
        uniform float vintageIntensity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        // Function to apply holographic effect
        vec4 applyHolographic(vec4 color) {
          // Rainbow gradient based on position and time
          float frequency = 0.6;
          float rainbow = sin(vUv.y * 20.0 + time * 2.0) * 0.5 + 0.5;
          vec4 holographicColor = vec4(
            sin(frequency * vUv.y + time) * 0.5 + 0.5,
            sin(frequency * vUv.y + time + 2.0) * 0.5 + 0.5,
            sin(frequency * vUv.y + time + 4.0) * 0.5 + 0.5,
            1.0
          );
          
          // Apply holographic as overlay with intensity control
          return mix(color, color * holographicColor, holographicIntensity * 0.7);
        }
        
        // Function to apply refractor effect
        vec4 applyRefractor(vec4 color) {
          // Subtle light refraction pattern
          float refractPattern = sin(vUv.x * 30.0 + vUv.y * 20.0 + time) * 0.5 + 0.5;
          vec4 refractColor = vec4(
            refractPattern * 0.2 + 0.8,
            refractPattern * 0.2 + 0.9,
            refractPattern * 0.3 + 0.7,
            1.0
          );
          
          // Apply refractor as multiply with intensity control
          return mix(color, color * refractColor, refractorIntensity * 0.6);
        }
        
        // Function to apply chrome effect
        vec4 applyChrome(vec4 color) {
          // Reflective gradient based on normal and position
          float chromePattern = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          vec4 chromeColor = vec4(
            chromePattern + 0.6,
            chromePattern + 0.6,
            chromePattern + 0.7,
            1.0
          );
          
          // Apply chrome as screen with intensity control
          return mix(color, color * chromeColor, chromeIntensity * 0.5);
        }
        
        // Function to apply vintage effect
        vec4 applyVintage(vec4 color) {
          // Sepia-like effect
          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          vec3 sepiaColor = vec3(
            gray * 1.2,
            gray * 0.95,
            gray * 0.8
          );
          
          // Add grain
          float grain = fract(sin(dot(vUv, vec2(12.9898, 78.233)) * 43758.5453) * 43758.5453);
          grain = grain * 0.1 - 0.05;
          
          // Apply vintage with intensity control
          vec4 vintageColor = vec4(mix(color.rgb, sepiaColor, 0.8) + grain, color.a);
          return mix(color, vintageColor, vintageIntensity * 0.7);
        }
        
        void main() {
          // Get base texture color
          vec4 color;
          
          // Choose texture based on flip state
          // The flip animation is mathematically determined for realistic card flip
          if (isFlipped) {
            // Back texture is applied when flipped
            color = texture2D(backTexture, vec2(1.0 - vUv.x, vUv.y));
          } else {
            // Front texture is applied when not flipped
            color = texture2D(frontTexture, vUv);
          }
          
          // Apply effects in sequence based on active flags
          if (hasHolographic && holographicIntensity > 0.0) {
            color = applyHolographic(color);
          }
          
          if (hasRefractor && refractorIntensity > 0.0) {
            color = applyRefractor(color);
          }
          
          if (hasChrome && chromeIntensity > 0.0) {
            color = applyChrome(color);
          }
          
          if (hasVintage && vintageIntensity > 0.0) {
            color = applyVintage(color);
          }
          
          gl_FragColor = color;
        }
      `
    };
  }, []);
  
  // Set up and manage uniforms for the shader
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.isFlipped.value = isFlipped;
      materialRef.current.uniforms.hasHolographic.value = activeEffects.includes('Holographic');
      materialRef.current.uniforms.hasRefractor.value = activeEffects.includes('Refractor');
      materialRef.current.uniforms.hasChrome.value = activeEffects.includes('Chrome');
      materialRef.current.uniforms.hasVintage.value = activeEffects.includes('Vintage');
      
      materialRef.current.uniforms.holographicIntensity.value = effectIntensities['Holographic'] || 0;
      materialRef.current.uniforms.refractorIntensity.value = effectIntensities['Refractor'] || 0;
      materialRef.current.uniforms.chromeIntensity.value = effectIntensities['Chrome'] || 0;
      materialRef.current.uniforms.vintageIntensity.value = effectIntensities['Vintage'] || 0;
      
      // Update stats
      setRenderingStats(prev => ({
        ...prev,
        textureApplied: true
      }));
    }
  }, [isFlipped, activeEffects, effectIntensities]);

  // Update time uniform and render stats
  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      
      // Measure render time
      const startTime = performance.now();
      // Actual render happens here when useFrame calls this function
      const renderTime = performance.now() - startTime;
      
      // Update render time occasionally, not every frame
      if (state.clock.getElapsedTime() % 1 < delta) {
        setRenderingStats(prev => ({
          ...prev,
          renderTime
        }));
      }
    }
  });

  // Card dimensions with proper aspect ratio (2.5 x 3.5)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.05; // Subtle thickness for 3D effect
  
  // Create shader material with uniforms
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: cardShader.vertexShader,
      fragmentShader: cardShader.fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        frontTexture: { value: frontTexture },
        backTexture: { value: backTexture },
        flipProgress: { value: 0 },
        time: { value: 0 },
        isFlipped: { value: isFlipped },
        hasHolographic: { value: activeEffects.includes('Holographic') },
        hasRefractor: { value: activeEffects.includes('Refractor') },
        hasChrome: { value: activeEffects.includes('Chrome') },
        hasVintage: { value: activeEffects.includes('Vintage') },
        holographicIntensity: { value: effectIntensities['Holographic'] || 0 },
        refractorIntensity: { value: effectIntensities['Refractor'] || 0 },
        chromeIntensity: { value: effectIntensities['Chrome'] || 0 },
        vintageIntensity: { value: effectIntensities['Vintage'] || 0 }
      }
    });
  }, [cardShader.vertexShader, cardShader.fragmentShader, frontTexture, backTexture, isFlipped, activeEffects, effectIntensities]);

  return (
    <>
      <mesh 
        ref={meshRef}
        rotation={[0, isFlipped ? Math.PI : 0, 0]} // Rotate card based on flip state
        position={[0, 0, 0]}
      >
        {/* Use BoxGeometry with very low depth value for card thickness */}
        <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
        <primitive 
          object={shaderMaterial} 
          ref={materialRef}
          attach="material"
        />
        
        {/* Add subtle edge highlight for better definition */}
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(cardWidth, cardHeight, cardThickness)]} />
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
