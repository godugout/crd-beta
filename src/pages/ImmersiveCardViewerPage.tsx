
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import RealisticCardViewer from '@/components/immersive-viewer/RealisticCardViewer';
import ImmersiveViewerInterface from '@/components/immersive-viewer/ImmersiveViewerInterface';
import { useCards } from '@/hooks/useCards';
import { basketballCards } from '@/data/basketballCards';

const ImmersiveCardViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, getCard, loading } = useCards();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  console.log('ImmersiveCardViewerPage: Looking for card with ID:', id);
  console.log('Cards loading state:', loading);
  console.log('Available cards from useCards:', cards?.length || 0);
  console.log('Available basketball cards:', basketballCards?.length || 0);

  // Try to find the card using multiple sources
  let card: Card | undefined;
  
  if (id) {
    // First try the getCard function from useCards hook
    if (getCard) {
      card = getCard(id);
      console.log('Found card via getCard:', card?.title || 'Not found');
    }
    
    // If not found via getCard, try direct search in basketball cards
    if (!card) {
      card = basketballCards.find(c => c.id === id);
      console.log('Found card via basketballCards search:', card?.title || 'Not found');
    }
    
    // If still not found, try in the cards array
    if (!card && cards && cards.length > 0) {
      card = cards.find(c => c.id === id);
      console.log('Found card via cards array search:', card?.title || 'Not found');
    }
  }

  // Show loading state while cards are being fetched
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading card...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    console.error('ImmersiveCardViewerPage: Card not found with ID:', id);
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
          <p className="text-gray-400 mb-6">The card you're looking for doesn't exist.</p>
          <p className="text-sm text-gray-500 mb-6">Looking for ID: {id}</p>
          <p className="text-sm text-gray-500 mb-6">Available cards: {cards?.length || 0}</p>
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

  console.log('ImmersiveCardViewerPage: Rendering card:', {
    id: card.id,
    title: card.title,
    imageUrl: card.imageUrl,
    hasImage: !!card.imageUrl
  });

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
