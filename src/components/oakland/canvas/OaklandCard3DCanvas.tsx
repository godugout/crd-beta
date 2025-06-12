
import React, { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw, Eye } from 'lucide-react';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import OaklandCard3DModel from './OaklandCard3DModel';
import Canvas3DControls from './Canvas3DControls';
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
  className?: string;
}

const CardLoadingFallback = () => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[2.5, 3.5, 0.1]} />
    <meshStandardMaterial color="#333333" opacity={0.5} transparent />
  </mesh>
);

const CameraController = ({ zoomLevel }: { zoomLevel: number }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame(() => {
    if (cameraRef.current) {
      const targetDistance = 6 - (zoomLevel - 100) * 0.02;
      cameraRef.current.position.setLength(Math.max(3, Math.min(10, targetDistance)));
    }
  });

  return (
    <PerspectiveCamera 
      ref={cameraRef}
      makeDefault 
      position={[0, 0, 6]} 
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
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [autoRotate, setAutoRotate] = useState(false);
  const [cardFinish, setCardFinish] = useState<'matte' | 'glossy' | 'foil'>('glossy');
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    onZoomChange(Math.min(zoomLevel + 25, 200));
  }, [zoomLevel, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    onZoomChange(Math.max(zoomLevel - 25, 50));
  }, [zoomLevel, onZoomChange]);

  const handleReset = useCallback(() => {
    onZoomChange(100);
    setAutoRotate(false);
  }, [onZoomChange]);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === '3d' ? '2d' : '3d');
  }, []);

  return (
    <div 
      ref={canvasRef}
      className={`relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden ${className}`}
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
        className="w-full h-full"
      >
        <CameraController zoomLevel={zoomLevel} />
        
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
          enableZoom={true}
          enableRotate={viewMode === '3d'}
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          minDistance={3}
          maxDistance={10}
          maxPolarAngle={Math.PI * 0.8}
          minPolarAngle={Math.PI * 0.2}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Canvas Controls Overlay */}
      <Canvas3DControls
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        isFullscreen={isFullscreen}
        onFullscreenToggle={onFullscreenToggle}
        viewMode={viewMode}
        onViewModeToggle={toggleViewMode}
        autoRotate={autoRotate}
        onAutoRotateToggle={() => setAutoRotate(!autoRotate)}
        cardFinish={cardFinish}
        onCardFinishChange={setCardFinish}
      />

      {/* Empty State */}
      {!selectedTemplate && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-500 bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <div className="text-6xl mb-4">⚾</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Choose Your Template</h3>
            <p className="text-gray-600">Select an Oakland A's template to see your memory card in 3D</p>
          </div>
        </div>
      )}

      {/* Performance Indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm rounded px-2 py-1">
        {viewMode.toUpperCase()} • {cardFinish} finish • {zoomLevel}%
      </div>
    </div>
  );
};

export default OaklandCard3DCanvas;
