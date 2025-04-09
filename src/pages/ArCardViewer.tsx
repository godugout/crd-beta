
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { useArCardViewer } from '@/hooks/useArCardViewer';
import { useParams } from 'react-router-dom';
import ArViewerContainer from '@/components/ar/ArViewerContainer';
import ArModeView from '@/components/ar/ArModeView';
import { Loader } from 'lucide-react';

const ArCardViewer = () => {
  const { id } = useParams<{ id?: string }>();
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

  if (isLoading) {
    return (
      <PageLayout
        title="AR Card Viewer"
        description="Loading your cards..."
      >
        <div className="container mx-auto pt-24 px-4 flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-lg text-gray-500">Loading your card collection...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      {!isArMode ? (
        <PageLayout
          title="AR Card Viewer"
          description="View your cards in augmented reality"
        >
          <div className="container mx-auto pt-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">AR Card Viewer</h1>
              <p className="mb-8 text-gray-600">
                Place your cards in the real world with our augmented reality feature.
                Select a card and launch the AR experience to get started.
              </p>
              
              <ArViewerContainer
                activeCard={activeCard}
                availableCards={availableCards}
                cameraError={cameraError}
                scale={scale}
                setScale={(s) => s}
                rotation={rotation}
                setRotation={(r) => r}
                onLaunchAr={handleLaunchAr}
              />
            </div>
          </div>
        </PageLayout>
      ) : (
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
      )}
    </>
  );
};

export default ArCardViewer;
