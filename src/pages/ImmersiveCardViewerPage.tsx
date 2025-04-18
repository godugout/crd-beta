
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/lib/types';
import { useCardLighting } from '@/hooks/useCardLighting';
import { useUserLightingPreferences } from '@/hooks/useUserLightingPreferences';
import RealisticCardViewer from '@/components/immersive-viewer/RealisticCardViewer';
import CustomizationPanel from '@/components/immersive-viewer/CustomizationPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';

const ImmersiveCardViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, getCardById } = useCards();
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [materialSettings, setMaterialSettings] = useState({
    roughness: 0.15,
    metalness: 0.3,
    reflectivity: 0.2,
    clearcoat: 0.1,
    envMapIntensity: 1.0
  });
  
  const { preferences, savePreferences } = useUserLightingPreferences();
  
  const {
    lightingSettings,
    lightingPreset,
    updateLightingSetting,
    applyPreset,
    isUserCustomized,
    toggleDynamicLighting
  } = useCardLighting(preferences?.environmentType || 'studio');

  // Load card data
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      try {
        const foundCard = getCardById(id);
        if (foundCard) {
          setCard(foundCard);
        } else {
          toast.error("Card not found");
          navigate('/cards');
        }
      } catch (err) {
        console.error("Error loading card:", err);
        toast.error("Failed to load card data");
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, getCardById, navigate]);

  // Save user preferences when they change
  useEffect(() => {
    if (isUserCustomized && lightingSettings) {
      savePreferences(lightingSettings);
    }
  }, [lightingSettings, isUserCustomized, savePreferences]);
  
  // Handle material settings updates
  const handleUpdateMaterial = (settings: Partial<typeof materialSettings>) => {
    setMaterialSettings(prev => ({
      ...prev,
      ...settings
    }));
  };
  
  // Handle sharing functionality
  const handleShare = () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: card?.title || 'Check out this amazing trading card!',
        text: card?.description || 'I found this awesome trading card',
        url: shareUrl,
      }).catch(error => {
        console.error('Error sharing:', error);
        navigator.clipboard.writeText(shareUrl)
          .then(() => toast.success('Link copied to clipboard'))
          .catch(() => toast.error('Failed to copy link'));
      });
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-32 h-48 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="mt-4 h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
          <p className="mb-6">The card you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/cards')}>Back to Gallery</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gray-900 overflow-hidden">
      {/* Top navigation */}
      <div className="absolute top-0 left-0 z-20 p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-white text-xl font-bold hidden md:block">{card.title}</h1>
      </div>
      
      {/* Share button */}
      <div className="absolute top-0 right-0 z-20 p-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
          onClick={handleShare}
        >
          <Share2 />
        </Button>
      </div>
      
      {/* Main 3D viewer */}
      <div className="w-full h-full">
        <RealisticCardViewer 
          card={card}
          isCustomizationOpen={isCustomizationOpen}
          onToggleCustomization={() => setIsCustomizationOpen(!isCustomizationOpen)}
        />
      </div>
      
      {/* Customization panel */}
      <CustomizationPanel 
        card={card}
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        lightingSettings={lightingSettings}
        onUpdateLighting={updateLightingSetting}
        onApplyPreset={applyPreset}
        onToggleDynamicLighting={toggleDynamicLighting}
        materialSettings={materialSettings}
        onUpdateMaterial={handleUpdateMaterial}
        onShareCard={handleShare}
        isUserCustomized={isUserCustomized}
      />
    </div>
  );
};

export default ImmersiveCardViewerPage;
