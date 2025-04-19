
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface VintageEffectProps {
  intensity?: number;
  isActive: boolean;
  cardTexture: THREE.Texture;
}

/**
 * Enhanced vintage effect with sepia tone and print artifacts
 */
const VintageEffect: React.FC<VintageEffectProps> = ({
  intensity = 1.0,
  isActive,
  cardTexture
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Load paper texture for vintage effect
  const paperTexture = useTexture('/textures/vintage-paper.jpg');
  
  // Only render the effect when active
  if (!isActive) return null;

  // Make sure textures are properly set up
  if (paperTexture) {
    paperTexture.wrapS = paperTexture.wrapT = THREE.RepeatWrapping;
    paperTexture.repeat.set(1, 1);
  }

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float intensity;
    uniform sampler2D cardTexture;
    uniform sampler2D paperTexture;
    varying vec2 vUv;
    
    void main() {
      // Sample the original card texture
      vec4 cardColor = texture2D(cardTexture, vUv);
      
      // Apply sepia tone effect
      vec3 sepia = vec3(
        cardColor.r * 0.393 + cardColor.g * 0.769 + cardColor.b * 0.189,
        cardColor.r * 0.349 + cardColor.g * 0.686 + cardColor.b * 0.168,
        cardColor.r * 0.272 + cardColor.g * 0.534 + cardColor.b * 0.131
      );
      
      // Sample the vintage paper texture
      vec4 paper = texture2D(paperTexture, vUv * 2.0);
      
      // Add print press artifacts
      float noise = fract(sin(vUv.x * 500.0 + vUv.y * 500.0) * 1000.0);
      float printDots = step(0.92, noise) * 0.1;
      
      // Add vignette effect
      vec2 center = vUv - 0.5;
      float vignette = 1.0 - dot(center, center) * 1.5;
      vignette = clamp(vignette, 0.0, 1.0);
      
      // Add slight color bleeding like old prints
      float bleed = noise * 0.03;
      
      // Mix sepia tone with paper texture and artifacts
      vec3 finalColor = mix(sepia, paper.rgb * sepia, 0.2) + vec3(printDots);
      finalColor *= vignette;
      finalColor += vec3(bleed, 0.0, 0.0); // Slight red bleed
      
      // Adjust contrast and brightness
      finalColor = (finalColor - 0.5) * 1.1 + 0.5; // Contrast
      finalColor *= 0.9; // Brightness
      
      // Apply intensity
      vec3 result = mix(cardColor.rgb, finalColor, intensity);
      
      gl_FragColor = vec4(result, cardColor.a);
    }
  `;

  return (
    <mesh position={[0, 0, 0.001]} renderOrder={5}>
      <planeGeometry args={[2.5, 3.5, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        uniforms={{
          intensity: { value: intensity },
          cardTexture: { value: cardTexture },
          paperTexture: { value: paperTexture }
        }}
      />
    </mesh>
  );
};

export default VintageEffect;
