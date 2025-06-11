
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { OaklandCardTemplate } from '@/lib/data/oaklandCardTemplates';

interface Card3DMeshProps {
  template: OaklandCardTemplate;
  title: string;
  subtitle: string;
  autoRotate?: boolean;
}

const Card3DMesh: React.FC<Card3DMeshProps> = ({ template, title, subtitle, autoRotate = true }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Load texture
  const frontTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(template.imageUrl);
    texture.flipY = false;
    return texture;
  }, [template.imageUrl]);

  // Create materials with Oakland A's styling
  const frontMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      roughness: 0.2,
      metalness: template.category === 'modern' ? 0.8 : 0.3,
      envMapIntensity: 1.5,
      clearcoat: template.effects.includes('chrome') ? 1.0 : 0.5,
      clearcoatRoughness: 0.1,
    });
  }, [frontTexture, template.category, template.effects]);

  const backMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: template.backgroundConfig.primary,
      roughness: 0.3,
      metalness: 0.7,
      envMapIntensity: 1.2,
      clearcoat: 0.8,
    });
  }, [template.backgroundConfig.primary]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Auto-rotation
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.2;
    }
    
    // Subtle floating animation
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.02;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Front of card - 2.5:3.5 aspect ratio */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={frontMaterial} />
      </mesh>
      
      {/* Back of card */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={backMaterial} />
      </mesh>
      
      {/* Card border/edge */}
      <mesh position={[0, 0, -0.005]}>
        <boxGeometry args={[2.5, 3.5, 0.01]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.8} />
      </mesh>
    </group>
  );
};

interface OaklandCard3DViewerProps {
  template: OaklandCardTemplate;
  title?: string;
  subtitle?: string;
  autoRotate?: boolean;
  environment?: 'studio' | 'sunset' | 'warehouse' | 'forest';
  className?: string;
}

const OaklandCard3DViewer: React.FC<OaklandCard3DViewerProps> = ({
  template,
  title = 'Oakland A\'s',
  subtitle = 'Baseball Card',
  autoRotate = true,
  environment = 'studio',
  className = ''
}) => {
  return (
    <div className={`w-full h-full min-h-[400px] ${className}`}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <Card3DMesh 
          template={template}
          title={title}
          subtitle={subtitle}
          autoRotate={autoRotate}
        />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />
        
        <Environment preset={environment} />
      </Canvas>
    </div>
  );
};

export default OaklandCard3DViewer;
