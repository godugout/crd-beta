
import React from 'react';
import { Text, Box } from '@react-three/drei';
import { CardData } from '@/lib/types/CardData';

interface CardBackProps {
  card: CardData;
  isFlipped?: boolean; // Make optional with default
}

const CardBack: React.FC<CardBackProps> = ({ card, isFlipped = false }) => {
  return (
    <Box position={[0, 0, -0.06]} rotation={[0, Math.PI, 0]}>
      <meshStandardMaterial color={card.backgroundColor} />
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.1}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {card.description}
      </Text>
    </Box>
  );
};

export default CardBack;
