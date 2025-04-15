
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCards } from '@/context/CardContext';
import PbrCardRenderer from '@/components/pbr/PbrCardRenderer';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Camera,
  Grid3X3,
  Layers,
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  X,
  KeyboardIcon,
  FlipHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

const CardViewerExperimental = () => {
  const [activeTab, setActiveTab] = useState('pbr');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<string[]>(['holographic']);
  const [showKeyboardControls, setShowKeyboardControls] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards } = useCards();

  const currentCard = cards?.find(card => card.id === id);
  const currentCardIndex = cards?.findIndex(card => card.id === id) ?? -1;
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          navigateToPrevious();
          break;
        case 'ArrowRight':
          navigateToNext();
          break;
        case 'f':
          toggleFlip();
          break;
        case 'Escape':
          if (isFullscreen) setIsFullscreen(false);
          break;
        case 'k':
          setShowKeyboardControls(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentCardIndex]);

  const navigateToNext = () => {
    if (!cards || cards.length <= 1) return;
    
    const nextIndex = (currentCardIndex + 1) % cards.length;
    navigate(`/labs/card-viewer/${cards[nextIndex].id}`);
  };

  const navigateToPrevious = () => {
    if (!cards || cards.length <= 1) return;
    
    const prevIndex = (currentCardIndex - 1 + cards.length) % cards.length;
    navigate(`/labs/card-viewer/${cards[prevIndex].id}`);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    toast.info(isFlipped ? 'Showing front side' : 'Showing back side');
  };

  const toggleEffect = (effect: string) => {
    setSelectedEffect(prev => {
      if (prev.includes(effect)) {
        return prev.filter(e => e !== effect);
      } else {
        return [...prev, effect];
      }
    });
  };

  const takeScreenshot = () => {
    toast.success('Screenshot saved to your gallery');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };
  
  return (
    <PageLayout
      title="Card Viewer Lab | CardShow"
      description="Experimental card viewing features"
    >
      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/10">
              <Minimize2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="h-full flex items-center justify-center" style={{ 
            backgroundImage: 'linear-gradient(rgba(0,0,0,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.5) 1px, transparent 1px)', 
            backgroundSize: '20px 20px'
          }}>
            {/* Navigation buttons */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={navigateToPrevious}
              className="absolute left-4 md:left-8 text-white hover:bg-white/10 h-12 w-12"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={navigateToNext}
              className="absolute right-4 md:right-8 text-white hover:bg-white/10 h-12 w-12"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
            
            {/* Card renderer */}
            <div className="w-full max-w-md h-[70vh]">
              <PbrCardRenderer 
                cardId={id} 
                isFlipped={isFlipped}
              />
            </div>
            
            {/* Bottom controls */}
            <div className="absolute bottom-4 left-0 right-0 px-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 mx-auto max-w-3xl flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="text-white">
                    <h3 className="font-medium">{currentCard?.title || 'Card'}</h3>
                    <p className="text-sm text-gray-300">
                      {currentCardIndex !== -1 ? `${currentCardIndex + 1} of ${cards?.length || 0}` : ''}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" className="text-white hover:bg-white/10" onClick={toggleFlip}>
                      <FlipHorizontal className="h-4 w-4 mr-2" />
                      Flip
                    </Button>
                    <Button variant="ghost" className="text-white hover:bg-white/10" onClick={takeScreenshot}>
                      <Camera className="h-4 w-4 mr-2" />
                      Screenshot
                    </Button>
                    <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setShowKeyboardControls(true)}>
                      <KeyboardIcon className="h-4 w-4 mr-2" />
                      Shortcuts
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {['holographic', 'refractor', 'shimmer', 'gold', 'vintage'].map(effect => (
                    <Button
                      key={effect}
                      variant={selectedEffect.includes(effect) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleEffect(effect)}
                      className={selectedEffect.includes(effect) 
                        ? "bg-blue-600 text-white" 
                        : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
                    >
                      {effect.charAt(0).toUpperCase() + effect.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Dialog open={showKeyboardControls} onOpenChange={setShowKeyboardControls}>
            <DialogContent className="sm:max-w-md">
              <div className="space-y-2 py-2">
                <h3 className="text-lg font-medium">Keyboard Controls</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                    <span>Arrow Keys</span>
                    <span className="text-muted-foreground">Move card</span>
                  </div>
                  <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                    <span>[/]</span>
                    <span className="text-muted-foreground">Rotate card</span>
                  </div>
                  <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                    <span>F</span>
                    <span className="text-muted-foreground">Flip card</span>
                  </div>
                  <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                    <span>E</span>
                    <span className="text-muted-foreground">Effects panel</span>
                  </div>
                  <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                    <span>+/-</span>
                    <span className="text-muted-foreground">Zoom in/out</span>
                  </div>
                  <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                    <span>R</span>
                    <span className="text-muted-foreground">Reset position</span>
                  </div>
                  <div className="flex justify-between px-2 py-1 bg-muted/50 rounded">
                    <span>Esc</span>
                    <span className="text-muted-foreground">Close panels</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <Container className="py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Card Viewer Lab</h1>
              <p className="text-muted-foreground mt-1">
                Experimental advanced card viewing technology
              </p>
            </div>
            <Button onClick={toggleFullscreen} className="gap-2">
              <Maximize2 className="h-4 w-4" />
              Fullscreen
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="pbr">PBR Rendering</TabsTrigger>
              <TabsTrigger value="ar">AR Preview</TabsTrigger>
              <TabsTrigger value="animation">Animation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pbr" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Physically Based Rendering (PBR)</CardTitle>
                  <CardDescription>
                    Experience cards with realistic materials and lighting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div 
                        className="bg-black rounded-lg overflow-hidden relative" 
                        style={{ 
                          backgroundImage: 'linear-gradient(rgba(20,20,40,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,40,.2) 1px, transparent 1px)', 
                          backgroundSize: '20px 20px'
                        }}
                      >
                        <PbrCardRenderer cardId={id} isFlipped={isFlipped} />
                        
                        <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2">
                          <Button 
                            variant="outline" 
                            className="bg-black/30 border-white/10 text-white hover:bg-black/50" 
                            onClick={toggleFlip}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Flip Card
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Visual Effects</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {['holographic', 'refractor', 'shimmer', 'gold', 'vintage'].map(effect => (
                              <Button
                                key={effect}
                                variant={selectedEffect.includes(effect) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleEffect(effect)}
                              >
                                {effect.charAt(0).toUpperCase() + effect.slice(1)}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Card Navigation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between">
                            <Button 
                              variant="outline" 
                              onClick={navigateToPrevious}
                              disabled={!cards || cards.length <= 1}
                            >
                              <ChevronLeft className="h-4 w-4 mr-2" />
                              Previous
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={navigateToNext}
                              disabled={!cards || cards.length <= 1}
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Keyboard Controls</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowKeyboardControls(true)}
                          >
                            <KeyboardIcon className="h-4 w-4 mr-2" />
                            Show Keyboard Shortcuts
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ar" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Augmented Reality Preview</CardTitle>
                  <CardDescription>
                    View your cards in augmented reality
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-10 text-center">
                    <div className="text-gray-500 mb-4">
                      AR functionality will be available soon.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="animation" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Card Animation Studio</CardTitle>
                  <CardDescription>
                    Create custom animations for your cards
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-10 text-center">
                    <div className="text-gray-500 mb-4">
                      Animation tools will be available soon.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Container>
      )}
    </PageLayout>
  );
};

export default CardViewerExperimental;
