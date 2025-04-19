
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/lib/types';
import PageLayout from '@/components/navigation/PageLayout';
import ArViewerContainer from '@/components/ar/ArViewerContainer';
import { useCards } from '@/context/CardContext';

const ArCardViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cards } = useCards();
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    if (id && cards) {
      const card = cards.find(c => c.id === id) || null;
      setActiveCard(card);
    }
  }, [id, cards]);

  const handleLaunchAr = () => {
    // Handle AR launch
    console.log('Launching AR experience');
    // Check for camera access
    if (!navigator.mediaDevices) {
      setCameraError('Camera access not available on this device');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // Camera access granted
        stream.getTracks().forEach(track => track.stop()); // Stop the camera after checking
      })
      .catch(err => {
        setCameraError(`Camera access denied: ${err.message}`);
      });
  };

  return (
    <PageLayout title="AR Card Viewer" description="View your cards in augmented reality">
      <div className="container mx-auto max-w-4xl p-4">
        <ArViewerContainer
          activeCard={activeCard}
          availableCards={cards}
          cameraError={cameraError}
          scale={scale}
          setScale={setScale}
          rotation={rotation}
          setRotation={setRotation}
          onLaunchAr={handleLaunchAr}
        />
      </div>
    </PageLayout>
  );
};

export default ArCardViewerPage;
