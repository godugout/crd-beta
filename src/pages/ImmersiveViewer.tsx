
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize2, ArrowRight, Home } from 'lucide-react';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';

const ImmersiveViewer: React.FC = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards } = useCards();
  
  const currentCardIndex = cards?.findIndex(card => card.id === id) ?? -1;
  const currentCard = currentCardIndex >= 0 ? cards?.[currentCardIndex] : null;
  
  useEffect(() => {
    // Automatically open the viewer when this page loads
    setIsViewerOpen(true);
    
    // Show toast when card is loaded
    if (currentCard) {
      toast.info(`Viewing: ${currentCard.name || 'Card'}`, {
        description: 'Use keyboard arrows to navigate between cards',
        duration: 3000,
      });
    }
  }, [id, currentCard]);
  
  const handleClose = () => {
    // Navigate back to gallery when closed
    setIsViewerOpen(false);
    navigate('/cards');
  };
  
  const handleNavigateNext = () => {
    if (!cards || cards.length <= 1 || currentCardIndex < 0) return;
    
    const nextIndex = (currentCardIndex + 1) % cards.length;
    navigate(`/immersive/${cards[nextIndex].id}`);
  };
  
  const handleNavigatePrev = () => {
    if (!cards || cards.length <= 1 || currentCardIndex < 0) return;
    
    const prevIndex = (currentCardIndex - 1 + cards.length) % cards.length;
    navigate(`/immersive/${cards[prevIndex].id}`);
  };
  
  if (!currentCard) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
        <p className="mb-6">The card you're looking for couldn't be loaded.</p>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/')} className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          <Button onClick={() => navigate('/cards')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            View Gallery
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      {!isViewerOpen && (
        <div className="p-8 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={() => navigate('/cards')} className="gap-2">
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
                alt={currentCard.title || currentCard.name} 
                className="rounded-lg shadow-xl w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{currentCard.name || currentCard.title}</h1>
            <p className="text-gray-400 mb-6">ID: {currentCard.id}</p>
            
            <Button size="lg" onClick={() => setIsViewerOpen(true)} className="gap-2">
              <Maximize2 className="h-5 w-5" />
              Experience in 3D
            </Button>
            
            <div className="flex gap-4 mt-8">
              <Button 
                variant="outline" 
                onClick={handleNavigatePrev}
                disabled={cards?.length <= 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Card
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNavigateNext}
                disabled={cards?.length <= 1}
                className="gap-2"
              >
                Next Card
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
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
