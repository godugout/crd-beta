
import React from 'react';
import * as THREE from 'three';

interface CardMeshProps {
  frontMaterial: THREE.Material;
  backMaterial: THREE.Material;
  onCardClick: (event: any) => void;
}

const CardMesh: React.FC<CardMeshProps> = ({
  frontMaterial,
  backMaterial,
  onCardClick
}) => {
  return (
    <>
      {/* Front of card */}
      <mesh 
        castShadow 
        receiveShadow
        onClick={onCardClick}
      >
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={frontMaterial} />
      </mesh>
      
      {/* Back of card with enhanced dark background and glowing figures */}
      <mesh 
        position={[0, 0, -0.01]} 
        rotation={[0, Math.PI, 0]} 
        castShadow 
        receiveShadow
        onClick={onCardClick}
      >
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={backMaterial} />
      </mesh>
    </>
  );
};

export default CardMesh;
