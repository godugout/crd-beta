
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface RefractorEffectProps {
  intensity?: number;
  isActive: boolean;
}

/**
 * Enhanced refractor effect with full card coverage
 */
const RefractorEffect: React.FC<RefractorEffectProps> = ({
  intensity = 1.0,
  isActive
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Only render the effect when active
  if (!isActive) return null;

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
    
    // Function to create prismatic refraction pattern
    vec3 prismColor(float angle) {
      vec3 color;
      angle = mod(angle, 6.28318);
      color.r = abs(sin(angle));
      color.g = abs(sin(angle + 2.0944));
      color.b = abs(sin(angle + 4.18879));
      return color;
    }
    
    void main() {
      // Create dynamic refraction pattern
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float dist = length(vUv - 0.5);
      
      // Create refraction lines that move across the card
      float lines = sin(dist * 30.0 - time * 0.5) * 0.5 + 0.5;
      lines = smoothstep(0.45, 0.55, lines);
      
      // Dynamic refraction angle based on time and position
      float refractAngle = angle * 3.0 + dist * 5.0 + time * 0.2;
      vec3 refractColor = prismColor(refractAngle);
      
      // Prismatic color separation
      float separation = 0.03 * sin(time * 0.5);
      vec3 refractR = prismColor(refractAngle + separation);
      vec3 refractG = prismColor(refractAngle);
      vec3 refractB = prismColor(refractAngle - separation);
      
      vec3 finalColor = vec3(
        refractR.r,
        refractG.g,
        refractB.b
      );
      
      // Create thin refraction lines for a more authentic look
      float pattern = abs(sin(vUv.x * 40.0 + vUv.y * 40.0 + time));
      pattern = smoothstep(0.95, 1.0, pattern);
      
      // Make the effect visible only at certain angles
      float visibility = pow(sin(dist * 3.14159 * 2.0 + time * 0.2) * 0.5 + 0.5, 0.5);
      
      // Apply intensity and full card coverage
      float alpha = (lines * 0.3 + pattern * 0.2 + 0.05) * visibility * intensity;
      
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
    <mesh position={[0, 0, 0.015]} renderOrder={12}>
      {/* Cover the full card with the effect */}
      <planeGeometry args={[2.5, 3.5, 32, 32]} />
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

export default RefractorEffect;
