
import React from 'react';
import { Environment, Sky } from '@react-three/drei';
import * as THREE from 'three';

export const StadiumEnvironment = () => {
  return (
    <>
      {/* High-quality stadium environment */}
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/stadium_01_1k.hdr"
        background={true}
        blur={0.2}
        intensity={1.5}
      />
      
      {/* Fallback sky if HDR fails to load */}
      <Sky 
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
        turbidity={10}
        rayleigh={3}
        mieCoefficient={0.005}
        mieDirectionalG={0.7}
      />
      
      {/* Stadium lighting */}
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1.5} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 15, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, 25, -10]} intensity={1} color="#fff8dc" />
      
      {/* Stadium atmosphere */}
      <fog attach="fog" args={['#2a3c5f', 80, 300]} />
      
      {/* Stadium field */}
      <mesh position={[0, -15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshLambertMaterial color="#1a4a1a" />
      </mesh>
    </>
  );
};
