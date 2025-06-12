
import React, { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import OaklandCard3DModel from './OaklandCard3DModel';
import BackgroundRenderer from './BackgroundRenderer';
import { BackgroundSettings } from './BackgroundSelector';
import CameraController from './components/CameraController';
import CardLoadingFallback from './components/CardLoadingFallback';
import EmptyStateDisplay from './components/EmptyStateDisplay';
import CanvasStatusIndicator from './components/CanvasStatusIndicator';
import CanvasControlsHint from './components/CanvasControlsHint';
import CanvasLighting from './components/CanvasLighting';

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
        
        {/* Lighting */}
        <CanvasLighting backgroundSettings={backgroundSettings} />

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
      {!selectedTemplate && <EmptyStateDisplay />}

      {/* Status Indicator */}
      <CanvasStatusIndicator 
        viewMode={viewMode}
        cardFinish={cardFinish}
        backgroundSettings={backgroundSettings}
      />

      {/* Controls Hint */}
      <CanvasControlsHint />
    </div>
  );
};

export default OaklandCard3DCanvas;
