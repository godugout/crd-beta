
import React from 'react';
import { Text } from '@react-three/drei';

interface CardTextOverlaysProps {
  memoryData: {
    title: string;
    subtitle: string;
    player?: string;
    date?: string;
  };
  teamColors: {
    primary: string;
    secondary: string;
  };
}

const CardTextOverlays: React.FC<CardTextOverlaysProps> = ({ memoryData, teamColors }) => {
  return (
    <>
      {/* Title */}
      <Text
        position={[0, 1.4, 0.01]}
        fontSize={0.18}
        color={teamColors.primary}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
        maxWidth={2.2}
      >
        {memoryData.title}
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, 1.1, 0.01]}
        fontSize={0.11}
        color={teamColors.secondary}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-medium.woff"
        maxWidth={2.2}
      >
        {memoryData.subtitle}
      </Text>

      {/* Player */}
      {memoryData.player && (
        <Text
          position={[0, -1.0, 0.01]}
          fontSize={0.14}
          color={teamColors.primary}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
          maxWidth={2.2}
        >
          {memoryData.player}
        </Text>
      )}

      {/* Date */}
      {memoryData.date && (
        <Text
          position={[0, -1.3, 0.01]}
          fontSize={0.09}
          color="#666666"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-regular.woff"
          maxWidth={2.2}
        >
          {new Date(memoryData.date).toLocaleDateString()}
        </Text>
      )}
    </>
  );
};

export default CardTextOverlays;
