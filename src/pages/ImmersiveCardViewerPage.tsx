
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/lib/types';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Menu, Sparkles, Info, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import CardEffectsPanel from '@/components/card-effects/CardEffectsPanel';
import ImmersiveCardViewer from '@/components/card-viewer/ImmersiveCardViewer';
import { sampleCards } from '@/lib/data/sampleCards';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import { adaptToCard } from '@/lib/adapters/cardAdapter';
import useCardEffects from '@/hooks/card-effects';
import ViewerControls from '@/components/gallery/viewer-components/ViewerControls';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';

const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

const ImmersiveCardViewerPage: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cards, getCardById } = useCards();
  const { toast } = useToast();
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true); // Panel open by default
  const [activeTab, setActiveTab] = useState('effects'); // Default tab
  const [drawerOpen, setDrawerOpen] = useState(false);
  const viewMode = searchParams.get('mode') || 'standard';
  
  const { 
    cardEffects, 
    addEffect, 
    removeEffect, 
    toggleEffect,
    setCardEffects,
    clearEffects,
    activeEffects,
    setActiveEffects
  } = useCardEffects();

  useEffect(() => {
    const loadCard = async () => {
      setIsLoading(true);
      try {
        let foundCard: Card | null = null;
        
        if (id) {
          console.log('Looking for card with ID:', id);
          
          foundCard = sampleCards.find(c => c.id === id) || null;
          
          if (!foundCard && getCardById) {
            foundCard = getCardById(id);
          } else if (!foundCard) {
            foundCard = cards.find(c => c.id === id) || null;
          }
        } else if (cards.length > 0) {
          foundCard = cards[0];
        } else if (sampleCards.length > 0) {
          foundCard = sampleCards[0];
        }
        
        if (foundCard) {
          console.log('Found card:', foundCard.title);
          
          const cardWithDefaults = adaptToCard({
            ...foundCard,
            imageUrl: foundCard.imageUrl || FALLBACK_IMAGE_URL,
            thumbnailUrl: foundCard.thumbnailUrl || foundCard.imageUrl || FALLBACK_IMAGE_URL,
            designMetadata: foundCard.designMetadata || DEFAULT_DESIGN_METADATA,
            createdAt: foundCard.createdAt || new Date().toISOString(),
            updatedAt: foundCard.updatedAt || new Date().toISOString(),
            userId: foundCard.userId || 'anonymous',
            effects: foundCard.effects || []
          });
          
          setCard(cardWithDefaults);
          
          if (cardWithDefaults.effects && cardWithDefaults.effects.length > 0) {
            setActiveEffects(cardWithDefaults.effects);
            setCardEffects(cardWithDefaults.id, cardWithDefaults.effects);
          }
        } else {
          console.error('Card not found with ID:', id);
          toast({
            title: "Card not found",
            description: "The requested card could not be found",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error loading card:', error);
        toast({
          title: "Error loading card",
          description: "There was a problem loading the card",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCard();
  }, [id, cards, getCardById, toast, setActiveEffects, setCardEffects]);
  
  const handleEffectToggle = (effect: string) => {
    if (card) {
      toggleEffect(card.id, effect);
      
      if (activeEffects.includes(effect)) {
        setActiveEffects(activeEffects.filter(e => e !== effect));
      } else {
        setActiveEffects([...activeEffects, effect]);
      }
    }
  };
  
  const handleApplyAllEffects = () => {
    if (card) {
      const allEffects = ['Holographic', 'Shimmer', 'Refractor', 'Vintage'];
      setActiveEffects(allEffects);
      setCardEffects(card.id, allEffects);
      toast({
        title: "All effects applied",
        description: "Experience the full power of CRD"
      });
    }
  };
  
  const handleClearEffects = () => {
    if (card) {
      clearEffects(card.id);
      setActiveEffects([]);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: card?.title || "CRD Card",
        text: card?.description || "Check out this amazing card on CRD!",
        url: window.location.href
      }).catch(err => {
        console.error("Error sharing:", err);
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Card link copied to clipboard"
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Card link copied to clipboard"
      });
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast({
          title: "Fullscreen error",
          description: "Unable to enter fullscreen mode",
          variant: "destructive"
        });
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <PageLayout 
      hideNavigation
      className="overflow-hidden bg-black"
      contentClassName="p-0"
    >
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Immersive Background with subtle gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/5 to-black/20 pointer-events-none z-0" />
        
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="text-white" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              
              {card && <h2 className="ml-4 text-white font-medium hidden sm:block">{card.title}</h2>}
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden md:block">
              {!isLoading && card && (
                <ViewerControls 
                  isFlipped={isFlipped}
                  isAutoRotating={isAutoRotating}
                  showInfo={showInfo}
                  showEffectsPanel={isPanelOpen}
                  onFlipCard={() => setIsFlipped(!isFlipped)}
                  onToggleAutoRotation={() => setIsAutoRotating(!isAutoRotating)}
                  onToggleInfo={() => setShowInfo(!showInfo)}
                  onToggleEffects={() => setIsPanelOpen(!isPanelOpen)}
                  onToggleFullscreen={handleToggleFullscreen}
                  onShare={handleShare}
                />
              )}
            </div>
            
            {/* Mobile Controls */}
            <div className="md:hidden">
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" className="text-white" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-gray-900 text-white">
                  <DrawerHeader className="border-b border-gray-800">
                    <DrawerTitle>Controls</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 space-y-4">
                    <Button 
                      className="w-full justify-start"
                      variant="ghost"
                      onClick={() => {
                        setIsFlipped(!isFlipped);
                        setDrawerOpen(false);
                      }}
                    >
                      {isFlipped ? "Show Front" : "Show Back"}
                    </Button>
                    <Button 
                      className="w-full justify-start"
                      variant="ghost"
                      onClick={() => {
                        setIsAutoRotating(!isAutoRotating);
                        setDrawerOpen(false);
                      }}
                    >
                      {isAutoRotating ? "Stop Rotation" : "Auto Rotate"}
                    </Button>
                    <Button 
                      className="w-full justify-start"
                      variant="ghost"
                      onClick={() => {
                        setShowInfo(!showInfo);
                        setDrawerOpen(false);
                      }}
                    >
                      Show Info
                    </Button>
                    <Button 
                      className="w-full justify-start"
                      variant="ghost"
                      onClick={() => {
                        setIsPanelOpen(!isPanelOpen);
                        setDrawerOpen(false);
                      }}
                    >
                      {isPanelOpen ? "Hide Effects" : "Show Effects"}
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="ghost"
                      onClick={() => {
                        handleShare();
                        setDrawerOpen(false);
                      }}
                    >
                      Share Card
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
        
        {/* Main Content Area with side panel */}
        <div className="flex h-[calc(100vh-56px)] relative">
          {/* Main Card Viewer */}
          <div className={cn(
            "flex-1 transition-all duration-500 ease-in-out",
            isPanelOpen ? "mr-[320px]" : "mr-0"
          )}>
            {/* Card View */}
            <div className="w-full h-full flex items-center justify-center">
              {isLoading || !card ? (
                <div className="w-full max-w-lg h-[500px] rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : (
                <Suspense fallback={
                  <div className="w-full max-w-lg h-[500px] rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-12 w-12 border-4 border-t-blue-500 border-blue-300/30 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading immersive experience...</p>
                    </div>
                  </div>
                }>
                  <div className="w-full h-full max-w-5xl">
                    <ImmersiveCardViewer 
                      card={card}
                      isFlipped={isFlipped}
                      activeEffects={activeEffects}
                      isAutoRotating={isAutoRotating}
                    />
                  </div>
                </Suspense>
              )}
            </div>
            
            {/* Overlay Info Panel */}
            {showInfo && card && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md p-4 rounded-lg max-w-md text-white border border-white/20">
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                {card.description && <p className="text-sm mb-2">{card.description}</p>}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {card.player && (
                    <div>
                      <span className="text-gray-400">Player: </span>
                      <span>{card.player}</span>
                    </div>
                  )}
                  {card.team && (
                    <div>
                      <span className="text-gray-400">Team: </span>
                      <span>{card.team}</span>
                    </div>
                  )}
                  {card.year && (
                    <div>
                      <span className="text-gray-400">Year: </span>
                      <span>{card.year}</span>
                    </div>
                  )}
                  {card.set && (
                    <div>
                      <span className="text-gray-400">Set: </span>
                      <span>{card.set}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Side Panel for Effects and Controls */}
          <div className={cn(
            "fixed right-0 top-[56px] bottom-0 w-[320px] bg-gray-900/95 backdrop-blur-lg border-l border-gray-800 z-40 transition-transform duration-500 ease-in-out",
            isPanelOpen ? "translate-x-0" : "translate-x-full"
          )}>
            {/* Floating toggle button for panel */}
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "absolute -left-12 top-4 bg-gray-800/70 backdrop-blur-sm text-white border border-gray-700 hover:bg-gray-700/80",
                isPanelOpen ? "rotate-180" : ""
              )} 
              onClick={() => setIsPanelOpen(!isPanelOpen)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            {/* Panel navigation buttons */}
            <div className="flex border-b border-gray-800">
              <Button 
                variant="ghost" 
                className={cn(
                  "flex-1 rounded-none border-b-2 py-3", 
                  activeTab === 'effects' 
                    ? "border-purple-500 text-purple-400" 
                    : "border-transparent text-gray-400 hover:text-gray-300"
                )} 
                onClick={() => setActiveTab('effects')}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Effects
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "flex-1 rounded-none border-b-2 py-3", 
                  activeTab === 'info' 
                    ? "border-blue-500 text-blue-400" 
                    : "border-transparent text-gray-400 hover:text-gray-300"
                )}
                onClick={() => setActiveTab('info')}
              >
                <Info className="h-4 w-4 mr-2" />
                Info
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "flex-1 rounded-none border-b-2 py-3", 
                  activeTab === 'controls' 
                    ? "border-emerald-500 text-emerald-400" 
                    : "border-transparent text-gray-400 hover:text-gray-300"
                )}
                onClick={() => setActiveTab('controls')}
              >
                <Sliders className="h-4 w-4 mr-2" />
                Controls
              </Button>
            </div>
            
            <div className="p-5 h-[calc(100%-56px)] overflow-y-auto">
              {/* Effects Tab Content */}
              {activeTab === 'effects' && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">Card Effects</h3>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleClearEffects}
                      >
                        Clear
                      </Button>
                      <Button 
                        size="sm" 
                        variant="default" 
                        onClick={handleApplyAllEffects}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Apply All
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {['Holographic', 'Shimmer', 'Refractor', 'Vintage'].map((effect) => (
                      <div 
                        key={effect} 
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all",
                          activeEffects.includes(effect) 
                            ? "bg-purple-900/40 border-purple-500/50" 
                            : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50"
                        )}
                        onClick={() => handleEffectToggle(effect)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-white">{effect}</h4>
                            <p className="text-xs text-gray-400">{getEffectDescription(effect)}</p>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2",
                            activeEffects.includes(effect) 
                              ? "border-purple-500 bg-purple-500/50" 
                              : "border-gray-600"
                          )}>
                            {activeEffects.includes(effect) && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Info Tab Content */}
              {activeTab === 'info' && card && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Card Details</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm text-gray-400 font-medium mb-1">Title</h4>
                        <p className="text-white">{card.title}</p>
                      </div>
                      
                      {card.description && (
                        <div>
                          <h4 className="text-sm text-gray-400 font-medium mb-1">Description</h4>
                          <p className="text-white">{card.description}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        {card.player && (
                          <div>
                            <h4 className="text-sm text-gray-400 font-medium mb-1">Player</h4>
                            <p className="text-white">{card.player}</p>
                          </div>
                        )}
                        
                        {card.team && (
                          <div>
                            <h4 className="text-sm text-gray-400 font-medium mb-1">Team</h4>
                            <p className="text-white">{card.team}</p>
                          </div>
                        )}
                        
                        {card.year && (
                          <div>
                            <h4 className="text-sm text-gray-400 font-medium mb-1">Year</h4>
                            <p className="text-white">{card.year}</p>
                          </div>
                        )}
                        
                        {card.set && (
                          <div>
                            <h4 className="text-sm text-gray-400 font-medium mb-1">Set</h4>
                            <p className="text-white">{card.set}</p>
                          </div>
                        )}
                      </div>
                      
                      {card.tags && card.tags.length > 0 && (
                        <div>
                          <h4 className="text-sm text-gray-400 font-medium mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {card.tags.map((tag, i) => (
                              <span 
                                key={i}
                                className="px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Controls Tab Content */}
              {activeTab === 'controls' && (
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-white mb-4">Viewer Controls</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h4 className="font-medium text-white mb-3">Card Position</h4>
                      <Button 
                        className="w-full"
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        {isFlipped ? "Show Front" : "Show Back"}
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-white">Auto Rotation</h4>
                        <Button
                          variant={isAutoRotating ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsAutoRotating(!isAutoRotating)}
                        >
                          {isAutoRotating ? "On" : "Off"}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">
                        Enable auto-rotation to see the card from all angles without manual interaction.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Mouse Controls</h4>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li className="flex items-center">
                          <span className="px-2 py-1 bg-gray-700 rounded mr-2 text-xs">Click + Drag</span>
                          <span>Rotate card</span>
                        </li>
                        <li className="flex items-center">
                          <span className="px-2 py-1 bg-gray-700 rounded mr-2 text-xs">Scroll</span>
                          <span>Zoom in/out</span>
                        </li>
                        <li className="flex items-center">
                          <span className="px-2 py-1 bg-gray-700 rounded mr-2 text-xs">Double Click</span>
                          <span>Reset position</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Touch Controls</h4>
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li className="flex items-center">
                          <span className="px-2 py-1 bg-gray-700 rounded mr-2 text-xs">1 Finger</span>
                          <span>Rotate card</span>
                        </li>
                        <li className="flex items-center">
                          <span className="px-2 py-1 bg-gray-700 rounded mr-2 text-xs">2 Fingers</span>
                          <span>Pinch to zoom</span>
                        </li>
                        <li className="flex items-center">
                          <span className="px-2 py-1 bg-gray-700 rounded mr-2 text-xs">Double Tap</span>
                          <span>Reset position</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

function getEffectDescription(effect: string): string {
  switch (effect) {
    case 'Holographic':
      return 'Rainbow prism effect that shifts as the card moves';
    case 'Shimmer':
      return 'Subtle metallic shimmer across the card surface';
    case 'Refractor':
      return 'Light-refracting pattern that creates a 3D depth effect';
    case 'Vintage':
      return 'Aged patina with subtle texture and color shifting';
    default:
      return 'Special visual effect';
  }
}

export default ImmersiveCardViewerPage;
