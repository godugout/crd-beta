
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import RealisticCardViewer from '@/components/immersive-viewer/RealisticCardViewer';
import ImmersiveViewerInterface from '@/components/immersive-viewer/ImmersiveViewerInterface';
import { useSampleCards } from '@/hooks/useSampleCards';

const ImmersiveCardViewerPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { cards } = useSampleCards();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const card = cards.find(c => c.id === cardId);

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
          <p className="text-gray-400 mb-6">The card you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/gallery')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/gallery');
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: card.title || 'Check out this card!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    // Create download functionality
    const link = document.createElement('a');
    link.href = card.imageUrl || '';
    link.download = `${card.title || 'card'}.jpg`;
    link.click();
    toast.success('Download started!');
  };

  const handleLike = () => {
    toast.success('Card liked!');
  };

  const handleBookmark = () => {
    toast.success('Card saved!');
  };

  const toggleCustomization = () => {
    setIsCustomizationOpen(!isCustomizationOpen);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* 3D Card Viewer */}
      <RealisticCardViewer
        card={card}
        isCustomizationOpen={isCustomizationOpen}
        onToggleCustomization={toggleCustomization}
      />
      
      {/* Interface Overlay */}
      <ImmersiveViewerInterface
        card={card}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        onBack={handleBack}
        onShare={handleShare}
        onDownload={handleDownload}
        onLike={handleLike}
        onBookmark={handleBookmark}
        isCustomizationOpen={isCustomizationOpen}
        onToggleCustomization={toggleCustomization}
      />
    </div>
  );
};

export default ImmersiveCardViewerPage;
