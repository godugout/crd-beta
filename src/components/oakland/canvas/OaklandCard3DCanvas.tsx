
import React, { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import OaklandCard3DModel from './OaklandCard3DModel';
import * as THREE from 'three';

interface OaklandCard3DCanvasProps {
  selectedTemplate: OaklandTemplate | null;
  memoryData: {
    title: string;
    subtitle: string;
    description: string;
    player?: string;
    date?: string;
    tags: string[];
  };
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  viewMode: '3d' | '2d';
  autoRotate: boolean;
  cardFinish: 'matte' | 'glossy' | 'foil';
  showEffects?: boolean;
  showBorder?: boolean;
  borderStyle?: 'classic' | 'vintage' | 'modern';
  className?: string;
}

const CardLoadingFallback = () => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[2.5, 3.5, 0.1]} />
    <meshStandardMaterial color="#333333" opacity={0.5} transparent />
  </mesh>
);

const CameraController = ({ zoomLevel, viewMode }: { zoomLevel: number; viewMode: '3d' | '2d' }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame(() => {
    if (cameraRef.current) {
      // Calculate target distance based on zoom level
      const baseDistance = viewMode === '2d' ? 4 : 6;
      const targetDistance = baseDistance - (zoomLevel - 100) * 0.02;
      const clampedDistance = Math.max(2, Math.min(12, targetDistance));
      
      // Smoothly interpolate to target distance
      const currentDistance = cameraRef.current.position.length();
      const newDistance = THREE.MathUtils.lerp(currentDistance, clampedDistance, 0.1);
      cameraRef.current.position.setLength(newDistance);

      // Adjust camera position for 2D mode
      if (viewMode === '2d') {
        cameraRef.current.position.x = 0;
        cameraRef.current.position.y = 0;
        cameraRef.current.position.z = newDistance;
        cameraRef.current.lookAt(0, 0, 0);
      }
    }
  });

  return (
    <PerspectiveCamera 
      ref={cameraRef}
      makeDefault 
      position={viewMode === '2d' ? [0, 0, 4] : [0, 0, 6]} 
      fov={45} 
    />
  );
};

const OaklandCard3DCanvas: React.FC<OaklandCard3DCanvasProps> = ({
  selectedTemplate,
  memoryData,
  isFullscreen,
  onFullscreenToggle,
  zoomLevel,
  onZoomChange,
  viewMode,
  autoRotate,
  cardFinish,
  showEffects = true,
  showBorder = true,
  borderStyle = 'classic',
  className = ''
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Handle mouse interactions
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsInteracting(true);
    e.preventDefault();
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsInteracting(false);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // Handle zoom with mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(50, Math.min(200, zoomLevel + e.deltaY * 0.1));
    onZoomChange(newZoom);
  }, [zoomLevel, onZoomChange]);

  return (
    <div 
      ref={canvasRef}
      className={`relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden select-none touch-none ${isInteracting ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      onWheel={handleWheel}
      style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
    >
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance"
        }}
        className="w-full h-full select-none touch-none"
        onPointerDown={() => setIsInteracting(true)}
        onPointerUp={() => setIsInteracting(false)}
      >
        <CameraController zoomLevel={zoomLevel} viewMode={viewMode} />
        
        {/* Enhanced Lighting Setup */}
        <ambientLight intensity={0.4} color="#f0f0ff" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.6} color="#EFB21E" />
        <spotLight 
          position={[0, 10, 0]} 
          intensity={0.8}
          angle={0.3}
          penumbra={0.5}
          color="#ffffff"
          castShadow
        />

        {/* Environment for reflections */}
        <Environment preset="studio" background={false} />

        {/* 3D Card Model */}
        <Suspense fallback={<CardLoadingFallback />}>
          {selectedTemplate && (
            <OaklandCard3DModel
              template={selectedTemplate}
              memoryData={memoryData}
              cardFinish={cardFinish}
              autoRotate={autoRotate}
              viewMode={viewMode}
              showEffects={showEffects}
              showBorder={showBorder}
              borderStyle={borderStyle}
            />
          )}
        </Suspense>

        {/* Ground Shadows */}
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.4} 
          scale={8} 
          blur={2.5} 
          far={4} 
        />

        {/* Orbit Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={false} // We handle zoom manually
          enableRotate={viewMode === '3d'}
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          minDistance={2}
          maxDistance={12}
          maxPolarAngle={Math.PI * 0.8}
          minPolarAngle={Math.PI * 0.2}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Empty State */}
      {!selectedTemplate && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-500 bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg select-text">
            <div className="text-6xl mb-4">⚾</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Choose Your Template</h3>
            <p className="text-gray-600">Select an Oakland A's template from the sidebar to see your memory card in 3D</p>
          </div>
        </div>
      )}

      {/* Enhanced Status Indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm rounded px-2 py-1 select-none">
        {viewMode.toUpperCase()} • {cardFinish} finish • {showBorder ? `${borderStyle} border` : 'simple edges'} • {showEffects ? 'effects on' : 'effects off'}
      </div>

      {/* Controls Hint */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm rounded px-2 py-1 select-none">
        <div>Mouse: Drag to rotate • Wheel: Zoom • Zoom: {zoomLevel}%</div>
      </div>
    </div>
  );
};

export default OaklandCard3DCanvas;
