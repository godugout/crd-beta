
import React from 'react';
import { Card } from '@/lib/types';
import { Html } from '@react-three/drei';

interface CardMetadataPanelProps {
  card: Card;
  isVisible: boolean;
}

const CardMetadataPanel: React.FC<CardMetadataPanelProps> = ({ card, isVisible }) => {
  if (!isVisible) return null;
  
  // Helper function to safely extract string properties
  const getStringProp = (value: any): string => {
    return typeof value === 'string' ? value : '';
  };
  
  // Safely extract card properties
  const cardPlayer = getStringProp(card.player);
  const cardTeam = getStringProp(card.team);
  const cardYear = getStringProp(card.year);
  
  return (
    <group position={[2, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2, 3]} />
        <meshBasicMaterial color="#1e1e1e" transparent opacity={0.8} />
        <Html position={[0, 0, 0.1]} transform>
          <div className="bg-black/80 p-4 rounded text-white" style={{ width: '240px' }}>
            <h3 className="font-bold text-lg mb-2">{card.title}</h3>
            {cardPlayer && <p className="text-sm">Player: {cardPlayer}</p>}
            {cardTeam && <p className="text-sm">Team: {cardTeam}</p>}
            {cardYear && <p className="text-sm">Year: {cardYear}</p>}
            <p className="text-xs mt-2 opacity-70">Press D to hide this panel</p>
          </div>
        </Html>
      </mesh>
    </group>
  );
};

export default CardMetadataPanel;
