
import React from 'react';
import { motion } from 'framer-motion';

interface MouseTrailProps {
  isDragging: boolean;
  mouseMoveSpeed: { x: number; y: number };
  position: { x: number; y: number };
}

const MouseTrail: React.FC<MouseTrailProps> = ({ 
  isDragging, 
  mouseMoveSpeed, 
  position 
}) => {
  if (!isDragging) return null;
  
  return (
    <motion.div
      className="pointer-events-none fixed rounded-full bg-blue-500 opacity-20 blur-md"
      initial={{ width: 20, height: 20 }}
      animate={{ 
        width: 20 + Math.min(mouseMoveSpeed.x + mouseMoveSpeed.y, 100),
        height: 20 + Math.min(mouseMoveSpeed.x + mouseMoveSpeed.y, 100)
      }}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default MouseTrail;
