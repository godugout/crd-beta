
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { useCards } from '@/context/CardContext';

const ImmersiveViewer: React.FC = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards } = useCards();
  
  const currentCard = cards?.find(card => card.id === id);
  
  useEffect(() => {
    // Automatically open the viewer when this page loads
    setIsViewerOpen(true);
  }, [id]);
  
  const handleClose = () => {
    // Navigate back to gallery when closed
    setIsViewerOpen(false);
    navigate('/gallery');
  };
  
  if (!currentCard) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
        <p className="mb-6">The card you're looking for couldn't be loaded.</p>
        <Button onClick={() => navigate('/gallery')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      {!isViewerOpen && (
        <div className="p-8 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={() => navigate('/gallery')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </Button>
            <Button onClick={() => setIsViewerOpen(true)} className="gap-2">
              <Maximize2 className="h-4 w-4" />
              Open Fullscreen Viewer
            </Button>
          </div>
          
          <div className="bg-black/20 rounded-xl p-8 flex flex-col items-center justify-center">
            <div className="w-64 h-90 mb-6">
              <img 
                src={currentCard.imageUrl} 
                alt={currentCard.title} 
                className="rounded-lg shadow-xl w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{currentCard.title}</h1>
            <p className="text-gray-400 mb-6">ID: {currentCard.id}</p>
            
            <Button size="lg" onClick={() => setIsViewerOpen(true)} className="gap-2">
              <Maximize2 className="h-5 w-5" />
              Experience in 3D
            </Button>
          </div>
        </div>
      )}
      
      <ImmersiveCardViewer
        isOpen={isViewerOpen}
        cardId={id}
        onClose={handleClose}
      />
    </div>
  );
};

export default ImmersiveViewer;
