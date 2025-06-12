
import React from 'react';
import * as THREE from 'three';

interface CardEdgesProps {
  cardSize: {
    width: number;
    height: number;
    depth: number;
  };
  templateCategory: string;
  viewMode: '3d' | '2d';
}

const CardEdges: React.FC<CardEdgesProps> = ({ cardSize, templateCategory, viewMode }) => {
  if (viewMode !== '3d') return null;

  const edgeColor = templateCategory === 'protest' ? '#DC2626' : '#EFB21E';

  return (
    <>
      {/* Top Edge */}
      <mesh position={[0, cardSize.height / 2, -cardSize.depth / 2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[cardSize.width, cardSize.depth]} />
        <meshPhysicalMaterial
          color={edgeColor}
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Bottom Edge */}
      <mesh position={[0, -cardSize.height / 2, -cardSize.depth / 2]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[cardSize.width, cardSize.depth]} />
        <meshPhysicalMaterial
          color={edgeColor}
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Left Edge */}
      <mesh position={[-cardSize.width / 2, 0, -cardSize.depth / 2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <planeGeometry args={[cardSize.height, cardSize.depth]} />
        <meshPhysicalMaterial
          color={edgeColor}
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Right Edge */}
      <mesh position={[cardSize.width / 2, 0, -cardSize.depth / 2]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <planeGeometry args={[cardSize.height, cardSize.depth]} />
        <meshPhysicalMaterial
          color={edgeColor}
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>
    </>
  );
};

export default CardEdges;
