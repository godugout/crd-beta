
import React from 'react';
import { Text, Box } from '@react-three/drei';
import { CardData } from '@/lib/types/CardData';

interface CardFrontProps {
  card: CardData;
  isFlipped?: boolean; // Make optional with default
}

const CardFront: React.FC<CardFrontProps> = ({ card, isFlipped = false }) => {
  return (
    <Box 
      position={[0, 0, 0.1]} 
      rotation={[0, Math.PI, 0]}
      visible={!isFlipped}
    >
      <meshStandardMaterial attach="material" color={card.backgroundColor} />
      <boxGeometry args={[2.5, 3.5, 0.2]} />
      
      {/* Card Content */}
      <Text
        position={[0, 1.2, 0.21]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {card.name}
      </Text>
      
      {/* Team and Jersey */}
      <Text
        position={[0, 0.8, 0.21]}
        fontSize={0.15}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {`${card.team} #${card.jersey}`}
      </Text>
    </Box>
  );
};

export default CardFront;
