
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import ArModeView from '@/components/ar/ArModeView';
import ArViewerInfo from '@/components/ar/ArViewerInfo';
import ArViewerContainer from '@/components/ar/ArViewerContainer';
import { useArCardViewer } from '@/hooks/useArCardViewer';
import '../components/home/card-effects/index.css';
import '../components/ar/arModeEffects.css';

const ArCardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const {
    activeCard,
    arCards,
    availableCards,
    isArMode,
    isFlipped,
    scale,
    rotation,
    cameraError,
    isLoading,
    handleLaunchAr,
    handleExitAr,
    handleCameraError,
    handleTakeSnapshot,
    handleFlip,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    handleAddCard,
    handleRemoveCard
  } = useArCardViewer(id);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {!isArMode && (
        <div className="absolute top-16 left-4 z-50 mt-2">
          <Button asChild variant="ghost">
            <Link to="/gallery" className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Return to Gallery
            </Link>
          </Button>
        </div>
      )}
      
      <main className={`flex-1 ${isArMode ? 'pt-0' : 'pt-16'}`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-32 h-48 bg-gray-300 rounded-lg"></div>
              <div className="h-4 w-24 bg-gray-300 mt-4 rounded"></div>
              <div className="h-3 w-32 bg-gray-200 mt-2 rounded"></div>
            </div>
          </div>
        ) : isArMode ? (
          <ArModeView 
            activeCards={arCards}
            availableCards={availableCards}
            onExitAr={handleExitAr}
            onCameraError={handleCameraError}
            onTakeSnapshot={handleTakeSnapshot}
            onFlip={handleFlip}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onRotate={handleRotate}
            onAddCard={handleAddCard}
            onRemoveCard={handleRemoveCard}
          />
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <ArViewerInfo cameraError={cameraError} />
              
              <ArViewerContainer
                activeCard={activeCard}
                availableCards={availableCards}
                cameraError={cameraError}
                scale={scale}
                setScale={setScale}
                rotation={rotation}
                setRotation={setRotation}
                onLaunchAr={handleLaunchAr}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArCardViewer;
