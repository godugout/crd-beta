
import React from 'react';

const CardLoadingFallback: React.FC = () => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[2.0, 2.8, 0.1]} />
    <meshStandardMaterial color="#333333" opacity={0.5} transparent />
  </mesh>
);

export default CardLoadingFallback;
