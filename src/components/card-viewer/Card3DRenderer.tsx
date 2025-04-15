
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
  const edgeGlowRef = useRef<THREE.Mesh>(null);
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

  // Fix the useTexture hook usage - it should receive an array of paths and a callback
  const textures = useTexture([frontTexturePath, backTexturePath], (loadedTextures) => {
    console.log('Textures loaded successfully:', loadedTextures);
    setRenderingStats(prev => ({
      ...prev,
      imageLoaded: true,
      warnings: prev.warnings.filter(w => !w.includes('texture loading'))
    }));
  });

  // Separate the front and back textures from the loaded array
  const frontTexture = textures[0];
  const backTexture = textures[1];
  
  useEffect(() => {
    // Ensure textures load correctly and apply proper settings
    if (frontTexture && backTexture) {
      console.log("Configuring textures:", { frontTexture, backTexture });
      
      // Configure texture settings for best appearance
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

  // Handle keyboard for diagnostics
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

  // Create improved shader for card front and back
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
        
        // Calculate metallic reflection effect
        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.0);
        vec3 metalColor = vec3(0.8, 0.8, 0.9); // Slight blue-ish silver
        
        if (isFlipped) {
          // Back of card - metallic effect with etched details
          vec4 backTex = texture2D(backTexture, vUv);
          float etching = 1.0 - (backTex.r + backTex.g + backTex.b) / 3.0;
          
          // Create dynamic light patterns
          float pattern1 = sin(vUv.x * 20.0 + time) * 0.5 + 0.5;
          float pattern2 = cos(vUv.y * 15.0 - time * 0.7) * 0.5 + 0.5;
          
          // Create metallic surface with etched details and dynamic patterns
          vec3 baseMetallic = mix(metalColor * 0.6, metalColor, fresnel);
          vec3 etchedColor = mix(baseMetallic * 0.3, baseMetallic, etching);
          vec3 finalColor = mix(etchedColor, etchedColor * 1.2, pattern1 * pattern2);
          
          texColor = vec4(finalColor, 1.0);
        } else {
          // Front of card - apply the front texture with enhanced lighting
          vec4 frontTex = texture2D(frontTexture, vUv);
          
          // Add subtle light reflections
          vec3 enhancedColor = frontTex.rgb * (1.0 + fresnel * 0.3);
          texColor = vec4(enhancedColor, frontTex.a);
        }
        
        gl_FragColor = texColor;
      }
    `
  }), []);

  // Create glow shader for the card edges
  const glowShader = useMemo(() => ({
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 glowColor;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Create pulsating neon effect
        float intensity = 0.8 + sin(time * 2.0) * 0.2;
        
        // Edge detection - only glow near the edges of the card
        float edgeFactorX = smoothstep(0.0, 0.1, vUv.x) * smoothstep(0.0, 0.1, 1.0 - vUv.x);
        float edgeFactorY = smoothstep(0.0, 0.1, vUv.y) * smoothstep(0.0, 0.1, 1.0 - vUv.y);
        float edgeFactor = 1.0 - (edgeFactorX * edgeFactorY);
        
        // Make the edge glow brighter
        float glowFactor = pow(edgeFactor, 2.0) * intensity;
        
        // Final color with pulsating neon
        vec3 finalColor = glowColor * glowFactor;
        gl_FragColor = vec4(finalColor, glowFactor * 0.8);
      }
    `
  }), []);

  // Update card rotation based on scroll speed and apply shader effects
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Apply rotation from scroll/swipe
      meshRef.current.rotation.y += rotationSpeed * delta;
      
      // Apply damping to slow down rotation
      setRotationSpeed(prev => prev * 0.95);
      
      // Update shader uniforms for card
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
        materialRef.current.uniforms.isFlipped.value = isFlipped;
      }
      
      // Also update glow edge effect
      if (edgeGlowRef.current?.material) {
        const glowMaterial = edgeGlowRef.current.material as THREE.ShaderMaterial;
        glowMaterial.uniforms.time.value = state.clock.getElapsedTime();
        
        // Position the glow mesh to match the card position and rotation
        edgeGlowRef.current.position.copy(meshRef.current.position);
        edgeGlowRef.current.rotation.copy(meshRef.current.rotation);
      }
    }
  });

  // Create shader material with uniforms for the card
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

  // Create glow material for edges
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: glowShader.vertexShader,
      fragmentShader: glowShader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        time: { value: 0 },
        glowColor: { value: new THREE.Color(0x00ffff) } // Cyan neon color
      }
    });
  }, [glowShader]);

  // Card dimensions with increased thickness
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.15; // Increased thickness for more 3D effect

  return (
    <>
      {/* Main card mesh */}
      <mesh 
        ref={meshRef}
        rotation={[0, isFlipped ? Math.PI : 0, 0]}
      >
        <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
        <primitive 
          object={shaderMaterial} 
          ref={materialRef}
          attach="material"
        />
      </mesh>
      
      {/* Glowing edge effect slightly larger than the card */}
      <mesh
        ref={edgeGlowRef}
        rotation={[0, isFlipped ? Math.PI : 0, 0]}
      >
        <boxGeometry args={[cardWidth + 0.05, cardHeight + 0.05, cardThickness + 0.05]} />
        <primitive
          object={glowMaterial}
          attach="material"
        />
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
