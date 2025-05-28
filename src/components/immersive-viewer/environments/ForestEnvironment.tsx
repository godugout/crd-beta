
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const SunbeamEffect = () => {
  const sunbeamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.3 }
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
          float sunbeam = sin(vUv.y * 10.0 + time) * 0.5 + 0.5;
          sunbeam *= sin(vUv.x * 3.0) * 0.3 + 0.7;
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
      sunbeamMaterial.uniforms.time.value += 0.005;
      requestAnimationFrame(animate);
    };
    animate();
  }, [sunbeamMaterial]);

  return (
    <>
      {/* Multiple sunbeam planes */}
      <mesh position={[10, 8, 0]} rotation={[0, 0, Math.PI * 0.1]}>
        <planeGeometry args={[2, 20]} />
        <primitive object={sunbeamMaterial} />
      </mesh>
      <mesh position={[-5, 12, 5]} rotation={[0, 0.3, Math.PI * 0.15]}>
        <planeGeometry args={[1.5, 18]} />
        <primitive object={sunbeamMaterial} />
      </mesh>
      <mesh position={[0, 15, -8]} rotation={[0, -0.2, Math.PI * 0.08]}>
        <planeGeometry args={[3, 25]} />
        <primitive object={sunbeamMaterial} />
      </mesh>
    </>
  );
};

export const ForestEnvironment = () => {
  return (
    <>
      {/* Forest background */}
      <color attach="background" args={['#1a2f1a']} />
      
      {/* Sunbeam effects */}
      <SunbeamEffect />
      
      {/* Use built-in forest environment */}
      <Environment 
        preset="forest"
        background={false}
        blur={0.6}
      />
      
      {/* Forest ambient lighting */}
      <ambientLight intensity={0.4} color="#90a865" />
      
      {/* Dappled sunlight */}
      <directionalLight 
        position={[20, 30, 15]} 
        intensity={2.5} 
        color="#fff8dc"
        castShadow
      />
      <directionalLight 
        position={[-10, 25, 20]} 
        intensity={1.8} 
        color="#f0f8d0"
        castShadow
      />
      <directionalLight 
        position={[5, 35, -18]} 
        intensity={1.5} 
        color="#fffacd"
      />
      
      {/* Filtered sunlight through canopy */}
      <spotLight
        position={[15, 40, 10]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.9}
        intensity={3.0}
        color="#fff8dc"
        castShadow
      />
      <spotLight
        position={[-8, 35, 18]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={2.5}
        color="#f5f5dc"
      />
      
      {/* Green forest reflections */}
      <pointLight position={[25, 15, 0]} intensity={0.6} color="#90ee90" />
      <pointLight position={[-25, 15, 0]} intensity={0.6} color="#9acd32" />
      <pointLight position={[0, 10, 30]} intensity={0.5} color="#adff2f" />
      <pointLight position={[0, 10, -30]} intensity={0.5} color="#98fb98" />
      
      {/* Understory lighting */}
      <pointLight position={[12, 3, 12]} intensity={0.3} color="#8fbc8f" />
      <pointLight position={[-12, 3, 12]} intensity={0.3} color="#90ee90" />
      <pointLight position={[0, 1, 0]} intensity={0.2} color="#7cfc00" />
      
      {/* Forest atmosphere */}
      <fog attach="fog" args={['#1a2f1a', 60, 200]} />
    </>
  );
};
