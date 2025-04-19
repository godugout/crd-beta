
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ShimmerEffectProps {
  intensity?: number;
  isActive: boolean;
}

/**
 * Enhanced shimmer effect with glossy finish
 * Optimized for better performance
 */
const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  intensity = 1.0,
  isActive
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Only render the effect when active
  if (!isActive) return null;

  // Simplified vertex shader
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vNormal = normalMatrix * normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // More efficient fragment shader
  const fragmentShader = `
    uniform float time;
    uniform float intensity;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
      // Simplified shimmer calculation
      float noise = fract(sin(vUv.x * 50.0 + vUv.y * 50.0 + time) * 500.0);
      float shimmerNoise = step(0.97, noise);
      
      // Glossy finish
      float glossy = pow(max(dot(normalize(vec3(0, 0, 1)), normalize(vNormal)), 0.0), 40.0);
      
      // Combine effects for final shimmer
      float shimmer = shimmerNoise * 0.3 + glossy * 0.7;
      
      // Create white/silver shimmer
      vec3 shimmerColor = vec3(1.0, 1.0, 1.0);
      float alpha = shimmer * intensity * 0.7;
      
      gl_FragColor = vec4(shimmerColor, alpha);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.intensity.value = intensity;
    }
  });

  return (
    <mesh position={[0, 0, 0.01]} renderOrder={11}>
      <planeGeometry args={[2.46, 3.46]} />
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

export default ShimmerEffect;
