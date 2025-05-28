
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const CausticsEffect = () => {
  const causticsMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#4fc3f7') }
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
        uniform vec3 color;
        varying vec2 vUv;
        
        float caustic(vec2 uv, float time) {
          vec2 p = mod(uv * 6.28318, 6.28318) - 250.0;
          vec2 i = vec2(p);
          float c = 1.0;
          float inten = 0.005;
          
          for (int n = 0; n < 5; n++) {
            float t = time * (1.0 - (3.5 / float(n+1)));
            i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
            c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
          }
          c /= 5.0;
          c = 1.17-pow(c, 1.4);
          return c;
        }
        
        void main() {
          float c = caustic(vUv, time * 0.5);
          gl_FragColor = vec4(color * c, c * 0.3);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, []);

  // Animate the caustics
  React.useEffect(() => {
    const animate = () => {
      causticsMaterial.uniforms.time.value += 0.01;
      requestAnimationFrame(animate);
    };
    animate();
  }, [causticsMaterial]);

  return (
    <mesh position={[0, 10, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <primitive object={causticsMaterial} />
    </mesh>
  );
};

export const UnderwaterEnvironment = () => {
  return (
    <>
      {/* Deep ocean background */}
      <color attach="background" args={['#001122']} />
      
      {/* Caustics effect */}
      <CausticsEffect />
      
      {/* Use built-in sunset environment for water feel */}
      <Environment 
        preset="sunset"
        background={false}
        blur={0.8}
      />
      
      {/* Underwater ambient lighting */}
      <ambientLight intensity={0.3} color="#004466" />
      
      {/* Filtered sunlight from above */}
      <directionalLight 
        position={[15, 30, 10]} 
        intensity={2.0} 
        color="#4fc3f7"
        castShadow
      />
      <directionalLight 
        position={[-10, 25, 15]} 
        intensity={1.5} 
        color="#81d4fa"
        castShadow
      />
      <directionalLight 
        position={[0, 35, -20]} 
        intensity={1.2} 
        color="#b3e5fc"
      />
      
      {/* Underwater light beams */}
      <spotLight
        position={[20, 40, 20]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.9}
        intensity={2.5}
        color="#4fc3f7"
        castShadow
      />
      <spotLight
        position={[-15, 35, 25]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={2.0}
        color="#81d4fa"
      />
      
      {/* Bioluminescent lighting */}
      <pointLight position={[30, 10, 0]} intensity={0.8} color="#00e5ff" />
      <pointLight position={[-30, 10, 0]} intensity={0.8} color="#18ffff" />
      <pointLight position={[0, 5, 40]} intensity={0.6} color="#84ffff" />
      <pointLight position={[0, 5, -40]} intensity={0.6} color="#b2ebf2" />
      
      {/* Deep water points of light */}
      <pointLight position={[20, -5, 20]} intensity={0.4} color="#00bcd4" />
      <pointLight position={[-20, -5, 20]} intensity={0.4} color="#26c6da" />
      <pointLight position={[0, -10, 0]} intensity={0.3} color="#4dd0e1" />
      
      {/* Underwater atmosphere */}
      <fog attach="fog" args={['#001122', 40, 150]} />
    </>
  );
};
