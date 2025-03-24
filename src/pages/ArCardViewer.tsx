
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Camera, PanelLeft, Smartphone, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import ArPreviewPanel from '@/components/ar/ArPreviewPanel';
import ArSettingsPanel from '@/components/ar/ArSettingsPanel';
import ArModeView from '@/components/ar/ArModeView';
import { supabase } from '@/integrations/supabase/client';
import '../components/home/card-effects/index.css';

// Define an interface that matches the actual database schema
interface CardRecord {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  thumbnail_url?: string | null;
  tags?: string[];
  collection_id?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  is_public?: boolean;
}

const ArCardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [arCards, setArCards] = useState<Card[]>([]);
  const [availableCards, setAvailableCards] = useState<Card[]>([]);
  const [isArMode, setIsArMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      
      try {
        // Fetch cards from the database
        const { data: cardsData, error } = await supabase
          .from('cards')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching cards:', error);
          toast.error('Failed to load cards');
          return;
        }
        
        // Convert the database cards to our Card format
        const formattedCards: Card[] = (cardsData as CardRecord[]).map(card => ({
          id: card.id,
          title: card.title,
          description: card.description || '',
          imageUrl: card.image_url || '',
          thumbnailUrl: card.thumbnail_url || card.image_url || '',
          tags: card.tags || [],
          createdAt: new Date(card.created_at),
          updatedAt: new Date(card.updated_at),
          collectionId: card.collection_id
        }));
        
        setAvailableCards(formattedCards);
        
        // If ID is provided, find that card, otherwise use the first one
        const cardById = id 
          ? formattedCards.find(card => card.id === id) 
          : null;
          
        const selectedCard = cardById || formattedCards[0] || null;
        setActiveCard(selectedCard);
        
        // Initialize AR cards with the active card
        if (selectedCard) {
          setArCards([selectedCard]);
        }
      } catch (err) {
        console.error('Error in card fetching process:', err);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCards();
  }, [id]);
  
  const handleLaunchAr = () => {
    setIsArMode(true);
    // Ensure the active card is in the AR scene
    if (activeCard && !arCards.some(card => card.id === activeCard.id)) {
      setArCards(prev => [...prev, activeCard]);
    }
    
    // Apply holographic effect CSS variables
    document.documentElement.style.setProperty('--shimmer-speed', '3s');
    document.documentElement.style.setProperty('--hologram-intensity', '0.7');
    document.documentElement.style.setProperty('--motion-speed', '1');
  };

  const handleExitAr = () => {
    setIsArMode(false);
  };

  const handleCameraError = (message: string) => {
    setCameraError(message);
    setIsArMode(false);
    toast.error('Camera error', { description: message });
  };

  const handleTakeSnapshot = () => {
    toast.success('Snapshot saved', {
      description: 'AR card image has been saved to your gallery'
    });
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 10, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  const handleAddCard = (card: Card) => {
    if (!arCards.some(c => c.id === card.id)) {
      setArCards(prev => [...prev, card]);
    }
  };
  
  const handleRemoveCard = (cardId: string) => {
    // Don't allow removing the last card
    if (arCards.length <= 1) {
      toast.error("Can't remove the last card");
      return;
    }
    
    setArCards(prev => prev.filter(card => card.id !== cardId));
  };

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
              <h1 className="text-3xl font-bold mb-6">Augmented Reality Card Viewer</h1>
              <p className="text-gray-600 mb-8">
                Experience your trading cards in augmented reality. Place multiple cards in the real world, position them with touch gestures, and share the experience with friends.
              </p>
              
              {cameraError && (
                <Alert className="mb-8 bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Camera Error</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {cameraError}
                  </AlertDescription>
                </Alert>
              )}
              
              {!cameraError && (
                <Alert className="mb-8 bg-amber-50 border-amber-200">
                  <Smartphone className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Ready for AR</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Camera access will be requested when you launch the AR experience. You'll be able to place multiple cards and position them with touch gestures.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <Tabs defaultValue="preview" className="w-full">
                  <div className="border-b">
                    <div className="px-6">
                      <TabsList className="mt-4">
                        <TabsTrigger value="preview">Card Preview</TabsTrigger>
                        <TabsTrigger value="settings">AR Settings</TabsTrigger>
                      </TabsList>
                    </div>
                  </div>
                  
                  <TabsContent value="preview" className="p-6">
                    <ArPreviewPanel 
                      activeCard={activeCard}
                      availableCards={availableCards}
                      cameraError={cameraError}
                      onLaunchAr={handleLaunchAr}
                    />
                  </TabsContent>
                  
                  <TabsContent value="settings" className="p-6">
                    <ArSettingsPanel
                      scale={scale}
                      setScale={setScale}
                      rotation={rotation}
                      setRotation={setRotation}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArCardViewer;
