
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Camera, PanelLeft, Smartphone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BASEBALL_CARDS } from '@/components/baseball/hooks/useBaseballCard';
import { CardData } from '@/components/baseball/types/BaseballCard';

const ArCardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [isArMode, setIsArMode] = useState(false);
  
  useEffect(() => {
    // If ID is provided, find that card, otherwise use the first one
    const card = id 
      ? BASEBALL_CARDS.find(card => card.id === id) 
      : BASEBALL_CARDS[0];
      
    setActiveCard(card || null);
  }, [id]);
  
  const handleLaunchAr = () => {
    setIsArMode(true);
    // In a real implementation, this would launch AR features
    setTimeout(() => {
      window.alert("This is a demo of AR functionality. In a real application, this would launch an AR experience using your device's camera.");
      setIsArMode(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="absolute top-16 left-4 z-50 mt-2">
        <Button asChild variant="ghost">
          <Link to="/gallery" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Return to Gallery
          </Link>
        </Button>
      </div>
      
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Augmented Reality Card Viewer</h1>
            <p className="text-gray-600 mb-8">
              Experience your trading cards in augmented reality. Place your cards in the real world, walk around them in 3D space, and share the experience with friends.
            </p>
            
            <Alert className="mb-8 bg-amber-50 border-amber-200">
              <Smartphone className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Demo Mode</AlertTitle>
              <AlertDescription className="text-amber-700">
                This is a technology demonstration. For the full AR experience, use our mobile app.
              </AlertDescription>
            </Alert>
            
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
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 flex flex-col">
                      <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                        {activeCard ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={activeCard.imageUrl} 
                              alt={activeCard.title}
                              className="w-full h-full object-contain"
                            />
                            
                            {isArMode && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="animate-pulse text-white text-center">
                                  <Camera className="w-16 h-16 mx-auto mb-4" />
                                  <p className="text-lg font-semibold">Launching AR Experience...</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-white">No card selected</div>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="lg"
                        onClick={handleLaunchAr}
                      >
                        <Camera className="mr-2 h-5 w-5" />
                        Launch AR Experience
                      </Button>
                    </div>
                    
                    <div className="md:w-64">
                      <h3 className="font-semibold mb-4">Available Cards</h3>
                      <div className="space-y-3">
                        {BASEBALL_CARDS.map(card => (
                          <Link 
                            key={card.id}
                            to={`/ar-card-viewer/${card.id}`}
                            className={`block p-3 rounded-md border transition-colors ${
                              activeCard?.id === card.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden mr-3">
                                <img 
                                  src={card.imageUrl} 
                                  alt={card.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{card.player}</div>
                                <div className="text-xs text-gray-500">{card.year} {card.manufacturer}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">AR Settings</h3>
                      <p className="text-gray-600 mb-4">
                        Adjust how cards appear in augmented reality.
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Scale</label>
                          <div className="flex items-center">
                            <input 
                              type="range" 
                              min="50" 
                              max="200" 
                              defaultValue="100" 
                              className="w-full" 
                            />
                            <span className="ml-2 text-sm w-12 text-right">100%</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Rotation Speed</label>
                          <div className="flex items-center">
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              defaultValue="50" 
                              className="w-full" 
                            />
                            <span className="ml-2 text-sm w-12 text-right">50%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <input id="auto-rotate" type="checkbox" className="mr-2" />
                          <label htmlFor="auto-rotate" className="text-sm">Auto-rotate card in AR mode</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input id="show-stats" type="checkbox" className="mr-2" defaultChecked />
                          <label htmlFor="show-stats" className="text-sm">Show card stats in AR</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Device Settings</h3>
                      <p className="text-gray-600 mb-4">
                        Configure your device for optimal AR experience.
                      </p>
                      
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-between">
                          Camera Calibration
                          <ChevronLeft className="h-4 w-4 rotate-180" />
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-between">
                          Test Device Compatibility
                          <ChevronLeft className="h-4 w-4 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArCardViewer;
