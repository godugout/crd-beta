
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import FullscreenViewer from '@/components/gallery/FullscreenViewer';
import PageLayout from '@/components/navigation/PageLayout';

const ImmersiveCardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards } = useCards();
  
  const handleClose = () => {
    navigate('/cards');
  };
  
  if (!id) {
    return (
      <PageLayout title="Card Viewer" description="View your card in immersive mode">
        <div className="container mx-auto py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">No card selected</h2>
          <p className="mb-6">Please select a card from your gallery to view.</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() => navigate('/cards')}
          >
            Go to Gallery
          </button>
        </div>
      </PageLayout>
    );
  }
  
  return <FullscreenViewer cardId={id} onClose={handleClose} />;
};

export default ImmersiveCardViewer;
