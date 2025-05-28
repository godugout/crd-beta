
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const SunbeamEffect = () => {
  const sunbeamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.4 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        varying vec2 vUv;
        
        void main() {
          float sunbeam = sin(vUv.y * 12.0 + time) * 0.5 + 0.5;
          sunbeam *= sin(vUv.x * 4.0) * 0.4 + 0.6;
          gl_FragColor = vec4(1.0, 0.9, 0.6, sunbeam * opacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, []);

  // Animate the sunbeams
  React.useEffect(() => {
    const animate = () => {
      sunbeamMaterial.uniforms.time.value += 0.008;
      requestAnimationFrame(animate);
    };
    animate();
  }, [sunbeamMaterial]);

  return (
    <>
      {/* Multiple sunbeam planes */}
      <mesh position={[15, 12, 0]} rotation={[0, 0, Math.PI * 0.12]}>
        <planeGeometry args={[3, 25]} />
        <primitive object={sunbeamMaterial} />
      </mesh>
      <mesh position={[-8, 18, 8]} rotation={[0, 0.4, Math.PI * 0.18]}>
        <planeGeometry args={[2.5, 22]} />
        <primitive object={sunbeamMaterial} />
      </mesh>
      <mesh position={[0, 20, -12]} rotation={[0, -0.3, Math.PI * 0.1]}>
        <planeGeometry args={[4, 30]} />
        <primitive object={sunbeamMaterial} />
      </mesh>
    </>
  );
};

export const ForestEnvironment = () => {
  return (
    <>
      {/* Forest background */}
      <color attach="background" args={['#1a3d1a']} />
      
      {/* Sunbeam effects */}
      <SunbeamEffect />
      
      {/* Use built-in forest environment */}
      <Environment 
        preset="forest"
        background={true}
        blur={0.5}
      />
      
      {/* Forest ambient lighting */}
      <ambientLight intensity={0.5} color="#90a865" />
      
      {/* Dappled sunlight */}
      <directionalLight 
        position={[25, 40, 20]} 
        intensity={3.2} 
        color="#fff8dc"
        castShadow
      />
      <directionalLight 
        position={[-15, 35, 25]} 
        intensity={2.5} 
        color="#f0f8d0"
        castShadow
      />
      <directionalLight 
        position={[8, 45, -22]} 
        intensity={2.0} 
        color="#fffacd"
      />
      
      {/* Filtered sunlight through canopy */}
      <spotLight
        position={[20, 50, 15]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.8}
        intensity={4.0}
        color="#fff8dc"
        castShadow
      />
      <spotLight
        position={[-12, 45, 25]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.7}
        intensity={3.5}
        color="#f5f5dc"
      />
      
      {/* Green forest reflections */}
      <pointLight position={[35, 20, 0]} intensity={0.8} color="#90ee90" />
      <pointLight position={[-35, 20, 0]} intensity={0.8} color="#9acd32" />
      <pointLight position={[0, 15, 40]} intensity={0.7} color="#adff2f" />
      <pointLight position={[0, 15, -40]} intensity={0.7} color="#98fb98" />
    </>
  );
};
