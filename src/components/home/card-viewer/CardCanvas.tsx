
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { CardData } from '@/lib/types/CardData';
import { OrbitControls } from '@react-three/drei';
import CardFront from './card-elements/CardFront';
import CardBack from './card-elements/CardBack';

interface CardCanvasProps {
  card: CardData;
  isFlipped: boolean;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ card, isFlipped }) => {
  return (
    <Canvas style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 1, 1]} intensity={0.8} />
      <OrbitControls enableZoom={false} enablePan={false} />
      
      {isFlipped ? (
        <CardBack card={card} />
      ) : (
        <CardFront card={card} />
      )}
    </Canvas>
  );
};

export default CardCanvas;
