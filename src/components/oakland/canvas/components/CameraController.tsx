
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface CameraControllerProps {
  zoomLevel: number;
  viewMode: '3d' | '2d';
  sidebarOpen?: boolean;
}

const CameraController: React.FC<CameraControllerProps> = ({ 
  zoomLevel, 
  viewMode, 
  sidebarOpen = false 
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame(() => {
    if (cameraRef.current) {
      // Calculate target distance based on zoom level
      const baseDistance = viewMode === '2d' ? 4 : 5;
      const targetDistance = baseDistance - (zoomLevel - 100) * 0.02;
      const clampedDistance = Math.max(2, Math.min(12, targetDistance));
      
      // Smoothly interpolate to target distance
      const currentDistance = cameraRef.current.position.length();
      const newDistance = THREE.MathUtils.lerp(currentDistance, clampedDistance, 0.1);
      
      // Adjust camera position based on sidebar state for centering
      const xOffset = sidebarOpen ? 0.2 : 0;
      
      if (viewMode === '2d') {
        cameraRef.current.position.set(xOffset, 0, newDistance);
        cameraRef.current.lookAt(xOffset, 0, 0);
      } else {
        // Maintain relative position in 3D
        const direction = cameraRef.current.position.clone().normalize();
        direction.multiplyScalar(newDistance);
        direction.x += xOffset;
        cameraRef.current.position.copy(direction);
        cameraRef.current.lookAt(xOffset, 0, 0);
      }
    }
  });

  const initialX = sidebarOpen ? 0.2 : 0;

  return (
    <PerspectiveCamera 
      ref={cameraRef}
      makeDefault 
      position={viewMode === '2d' ? [initialX, 0, 4] : [initialX, 0, 5]} 
      fov={45} 
    />
  );
};

export default CameraController;
