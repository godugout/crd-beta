
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { Camera, Smartphone, Scan, Info } from 'lucide-react';
import CardMedia from '@/components/gallery/CardMedia';
import { toast } from 'sonner';
import { useArCardViewer } from '@/hooks/useArCardViewer';
import ArModeView from '@/components/ar/ArModeView';

const ArCardViewer = () => {
  const { id } = useParams();
  const { cards } = useCards();
  const navigate = useNavigate();
  
  const {
    activeCard,
    arCards,
    availableCards,
    isArMode,
    isFlipped,
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

  if (isArMode) {
    return (
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
    );
  }

  // Handle card selection from the list
  const handleCardSelect = (card: Card) => {
    navigate(`/ar-viewer/${card.id}`);
  };

  const handleGenerateQR = () => {
    toast.success('QR Code Generated', {
      description: 'Scan this code to view this card in AR on your mobile device'
    });
  };
  
  return (
    <PageLayout
      title="AR Card Viewer"
      description="View your cards in augmented reality"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">AR Card Viewer</h1>
        <p className="text-gray-600 mb-8">Experience your cards in augmented reality</p>
        
        <Tabs defaultValue="viewer" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="viewer" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              AR Viewer
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              QR Scanner
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Help
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="viewer" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card selection sidebar */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium mb-4">Select a Card</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {cards.slice(0, 8).map(card => (
                      <div 
                        key={card.id} 
                        className={`cursor-pointer flex items-center gap-3 p-2 rounded-md
                          ${activeCard?.id === card.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-gray-50'}`}
                        onClick={() => handleCardSelect(card)}
                      >
                        <div className="h-16 w-12 flex-shrink-0">
                          <CardMedia card={card} onView={() => {}} className="h-full" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-sm truncate">{card.title}</h4>
                          {card.tags && card.tags.length > 0 && (
                            <p className="text-xs text-gray-500 truncate">{card.tags[0]}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {cards.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-3">No cards found</p>
                        <Button size="sm" onClick={() => navigate('/cards/create')}>
                          Add Card
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* AR viewer main area */}
              <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-lg border h-full">
                  {activeCard ? (
                    <div className="space-y-6">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="max-h-full max-w-[50%]">
                            <CardMedia card={activeCard} onView={() => {}} className="h-full shadow-lg" />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-lg pointer-events-none" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-medium">{activeCard.title}</h3>
                        <p className="text-gray-600 text-sm">{activeCard.description || 'No description available'}</p>
                      </div>
                      
                      <div className="flex gap-3 flex-wrap">
                        <CrdButton onClick={handleLaunchAr} className="flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          View in AR
                        </CrdButton>
                        <CrdButton variant="outline" onClick={handleGenerateQR} className="flex items-center gap-2">
                          <Scan className="h-4 w-4" />
                          Generate QR Code
                        </CrdButton>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">Select a card to view in AR</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                          Choose a card from the list to experience it in augmented reality
                        </p>
                        <Button onClick={() => navigate('/cards')}>
                          Browse Cards
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="scanner" className="space-y-6">
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="py-12">
                <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">QR Scanner</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Scan a CardShow QR code to instantly view the card in AR mode
                </p>
                <CrdButton className="flex items-center gap-2 mx-auto">
                  <Camera className="h-4 w-4" />
                  Launch Camera
                </CrdButton>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="help" className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-medium text-lg mb-4">How to Use AR Viewer</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-crd-primary/10 flex items-center justify-center text-crd-primary">1</div>
                  <div>
                    <h4 className="font-medium mb-1">Select a Card</h4>
                    <p className="text-gray-600 text-sm">Choose any card from your collection to view in AR mode</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-crd-primary/10 flex items-center justify-center text-crd-primary">2</div>
                  <div>
                    <h4 className="font-medium mb-1">Launch AR Mode</h4>
                    <p className="text-gray-600 text-sm">Click the "View in AR" button to open the AR experience</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-crd-primary/10 flex items-center justify-center text-crd-primary">3</div>
                  <div>
                    <h4 className="font-medium mb-1">Scan Your Surface</h4>
                    <p className="text-gray-600 text-sm">Point your camera at a flat surface where you want to place the card</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-crd-primary/10 flex items-center justify-center text-crd-primary">4</div>
                  <div>
                    <h4 className="font-medium mb-1">Experience Your Card</h4>
                    <p className="text-gray-600 text-sm">Move around to see your card from different angles</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 text-blue-700 rounded-md">
                <h4 className="font-medium mb-2">Device Requirements</h4>
                <p className="text-sm">AR features work best on newer mobile devices with AR capabilities.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ArCardViewer;
