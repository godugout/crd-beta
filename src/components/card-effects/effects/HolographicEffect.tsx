
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface HolographicEffectProps {
  intensity?: number;
  isActive: boolean;
}

/**
 * Enhanced holographic effect with geometric patterns and rainbow gradients
 */
const HolographicEffect: React.FC<HolographicEffectProps> = ({
  intensity = 1.0,
  isActive
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Only render the effect when active
  if (!isActive) return null;

  // Custom shader for holographic effect
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float intensity;
    varying vec2 vUv;
    
    // Function to create geometric patterns
    float pattern(vec2 uv) {
      float s = sin(uv.x * 10.0 + time * 0.5);
      float t = sin(uv.y * 10.0 + time * 0.5);
      return s * t;
    }
    
    void main() {
      // Rainbow gradient that shifts based on time and position
      float hue = mod(vUv.x * 2.0 + vUv.y * 1.0 + time * 0.1, 1.0);
      vec3 rainbow;
      
      // Convert HSV to RGB
      float h = hue * 6.0;
      float i = floor(h);
      float f = h - i;
      float q = 1.0 - f;
      
      if (i == 0.0) rainbow = vec3(1.0, f, 0.0);
      else if (i == 1.0) rainbow = vec3(q, 1.0, 0.0);
      else if (i == 2.0) rainbow = vec3(0.0, 1.0, f);
      else if (i == 3.0) rainbow = vec3(0.0, q, 1.0);
      else if (i == 4.0) rainbow = vec3(f, 0.0, 1.0);
      else rainbow = vec3(1.0, 0.0, q);
      
      // Generate subtle geometric patterns
      float grid = pattern(vUv * 5.0);
      float dots = smoothstep(0.3, 0.7, sin(vUv.x * 40.0) * sin(vUv.y * 40.0));
      
      // Adjust visibility based on viewing angle (simulated with UV coordinates)
      float visibility = pow(sin(vUv.x * 3.14159) * sin(vUv.y * 3.14159) * 1.5, 0.5);
      
      // Only show effect at certain angles (when "catching the light")
      float angleVisibility = smoothstep(0.1, 0.3, sin(time * 0.5 + vUv.x * 6.0) * 0.5 + 0.5);
      
      // Final color with proper blending
      vec3 finalColor = rainbow * (0.5 + grid * 0.05 + dots * 0.05);
      
      // Apply intensity and visibility
      float alpha = visibility * angleVisibility * intensity * 0.5;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.intensity.value = intensity;
    }
  });

  return (
    <mesh position={[0, 0, 0.005]} renderOrder={10}>
      <planeGeometry args={[2.48, 3.48, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        uniforms={{
          time: { value: 0 },
          intensity: { value: intensity }
        }}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

export default HolographicEffect;
