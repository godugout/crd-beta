
import React, { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import OaklandCard3DModel from './OaklandCard3DModel';
import BackgroundRenderer from './BackgroundRenderer';
import { BackgroundSettings } from './BackgroundSelector';
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
  sidebarOpen?: boolean;
  backgroundSettings?: BackgroundSettings;
}

const CardLoadingFallback = () => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[2.0, 2.8, 0.1]} />
    <meshStandardMaterial color="#333333" opacity={0.5} transparent />
  </mesh>
);

const CameraController = ({ zoomLevel, viewMode, sidebarOpen }: { 
  zoomLevel: number; 
  viewMode: '3d' | '2d';
  sidebarOpen?: boolean;
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
  className = '',
  sidebarOpen = false,
  backgroundSettings = {
    type: 'preset',
    preset: 'studio',
    intensity: 1.0,
    blur: 0.0,
    rotation: 0
  }
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Handle mouse interactions - removed conflicting handlers
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

  // Enhanced zoom with mouse wheel - improved sensitivity
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.2; // Increased from 0.1
    const newZoom = Math.max(50, Math.min(200, zoomLevel + e.deltaY * zoomSensitivity));
    onZoomChange(newZoom);
  }, [zoomLevel, onZoomChange]);

  return (
    <div 
      ref={canvasRef}
      className={`relative w-full h-full overflow-hidden select-none touch-none ${isInteracting ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      onWheel={handleWheel}
      style={{ userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
    >
      {/* Enhanced 3D Canvas with better performance */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        className="w-full h-full select-none touch-none"
      >
        <CameraController zoomLevel={zoomLevel} viewMode={viewMode} sidebarOpen={sidebarOpen} />
        
        {/* Background Renderer */}
        <BackgroundRenderer settings={backgroundSettings} />
        
        {/* Enhanced Lighting Setup */}
        <ambientLight intensity={0.4 * backgroundSettings.intensity} color="#f0f0ff" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2 * backgroundSettings.intensity}
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
        <pointLight 
          position={[-5, 5, 5]} 
          intensity={0.6 * backgroundSettings.intensity} 
          color="#EFB21E" 
        />
        <spotLight 
          position={[0, 10, 0]} 
          intensity={0.8 * backgroundSettings.intensity}
          angle={0.3}
          penumbra={0.5}
          color="#ffffff"
          castShadow
        />

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
              sidebarOpen={sidebarOpen}
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
        {viewMode.toUpperCase()} • {cardFinish} finish • {backgroundSettings.type} background • Enhanced controls
      </div>

      {/* Enhanced Controls Hint */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm rounded px-2 py-1 select-none">
        <div>Drag: Smooth rotate • Wheel: Zoom • F: Flip • Space: Auto-rotate • R: Reset</div>
      </div>
    </div>
  );
};

export default OaklandCard3DCanvas;
