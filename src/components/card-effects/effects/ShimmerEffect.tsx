
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ShimmerEffectProps {
  intensity?: number;
  isActive: boolean;
}

/**
 * Enhanced shimmer effect with glossy finish
 */
const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  intensity = 1.0,
  isActive
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Only render the effect when active
  if (!isActive) return null;

  const vertexShader = `
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
  `;

  const fragmentShader = `
    uniform float time;
    uniform float intensity;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      // Calculate view angle for specular highlight
      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vNormal);
      
      // Create moving light direction for dynamic shimmer
      vec3 lightDir = normalize(vec3(
        sin(time * 0.5),
        0.5,
        cos(time * 0.5)
      ));
      
      // Calculate specular reflection
      vec3 halfVector = normalize(lightDir + viewDir);
      float specular = pow(max(dot(normal, halfVector), 0.0), 50.0);
      
      // Add more dynamic shimmer with noise
      float noise = fract(sin(vUv.x * 100.0 + vUv.y * 100.0 + time) * 1000.0);
      float shimmerNoise = step(0.97, noise);
      
      // Glossy finish with moving highlights
      float glossy = pow(max(dot(viewDir, reflect(lightDir, normal)), 0.0), 40.0);
      
      // Combine effects for final shimmer
      float shimmer = specular * 0.7 + shimmerNoise * 0.3 + glossy * 0.5;
      
      // Create white/silver shimmer with high intensity
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
      <planeGeometry args={[2.46, 3.46, 32, 32]} />
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
