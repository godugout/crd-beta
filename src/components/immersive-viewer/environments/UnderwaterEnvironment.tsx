
import React, { useMemo } from 'react';
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
    <mesh position={[0, 15, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
      <planeGeometry args={[150, 150]} />
      <primitive object={causticsMaterial} />
    </mesh>
  );
};

export const UnderwaterEnvironment = () => {
  // Create underwater background texture
  const underwaterTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Deep ocean gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#001a33');
      gradient.addColorStop(0.3, '#003366');
      gradient.addColorStop(0.7, '#004080');
      gradient.addColorStop(1, '#0066cc');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add underwater bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const size = Math.random() * 8 + 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Add water surface light rays
      ctx.strokeStyle = 'rgba(76, 195, 247, 0.4)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 10; i++) {
        const x = i * 100 + Math.random() * 50;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + Math.random() * 100 - 50, 512);
        ctx.stroke();
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      {/* Deep ocean background */}
      <primitive object={underwaterTexture} attach="background" />
      
      {/* Caustics effect */}
      <CausticsEffect />
      
      {/* Underwater ambient lighting */}
      <ambientLight intensity={0.4} color="#004466" />
      
      {/* Filtered sunlight from above */}
      <directionalLight 
        position={[20, 40, 15]} 
        intensity={2.5} 
        color="#4fc3f7"
        castShadow
      />
      <directionalLight 
        position={[-15, 35, 20]} 
        intensity={2.0} 
        color="#81d4fa"
        castShadow
      />
      <directionalLight 
        position={[0, 45, -25]} 
        intensity={1.8} 
        color="#b3e5fc"
      />
      
      {/* Underwater light beams */}
      <spotLight
        position={[25, 50, 25]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.8}
        intensity={3.5}
        color="#4fc3f7"
        castShadow
      />
      <spotLight
        position={[-20, 45, 30]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.7}
        intensity={3.0}
        color="#81d4fa"
      />
      
      {/* Bioluminescent lighting */}
      <pointLight position={[40, 15, 0]} intensity={1.2} color="#00e5ff" />
      <pointLight position={[-40, 15, 0]} intensity={1.2} color="#18ffff" />
      <pointLight position={[0, 8, 50]} intensity={1.0} color="#84ffff" />
      <pointLight position={[0, 8, -50]} intensity={1.0} color="#b2ebf2" />
    </>
  );
};
