
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { ImmersiveCardViewer } from '@/components/card-viewer';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Maximize2, Eye } from 'lucide-react';

const ImmersiveCardViewerDemo: React.FC = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { id } = useParams();
  const { cards } = useCards();
  
  const currentCard = id ? cards?.find(card => card.id === id) : cards?.[0];
  
  const openViewer = () => {
    setIsViewerOpen(true);
  };
  
  const closeViewer = () => {
    setIsViewerOpen(false);
  };
  
  return (
    <PageLayout
      title="Immersive Card Viewer | CardShow"
      description="Experience cards in premium 3D with realistic effects"
    >
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Immersive Card Viewer</h1>
          <p className="text-muted-foreground mt-1">
            Experience your cards in stunning 3D with realistic effects
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interactive 3D Card Experience</CardTitle>
                <CardDescription>
                  View your cards in fully immersive 3D with physics-based interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {currentCard && (
                  <div className="relative w-full max-w-md h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                    <img 
                      src={currentCard.imageUrl} 
                      alt={currentCard.title} 
                      className="max-h-[85%] max-w-[85%] object-contain rounded shadow-lg"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/40"></div>
                    
                    <Button 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-2"
                      variant="default"
                      size="lg"
                      onClick={openViewer}
                    >
                      <Maximize2 className="h-5 w-5" />
                      View Full Experience
                    </Button>
                  </div>
                )}
                
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <Button variant="outline" className="gap-2" onClick={openViewer}>
                    <Eye className="h-4 w-4" />
                    View Card
                  </Button>
                  
                  <Button variant="default" className="gap-2" onClick={openViewer}>
                    <Maximize2 className="h-4 w-4" />
                    Fullscreen View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Premium Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500/10 p-1 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div>
                      <span className="font-medium">Realistic Physics</span>
                      <p className="text-sm text-muted-foreground">
                        Cards respond to touch with natural momentum and inertia
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500/10 p-1 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div>
                      <span className="font-medium">Enhanced Effects</span>
                      <p className="text-sm text-muted-foreground">
                        Holographic, refractor, and foil effects that react to movement
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500/10 p-1 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div>
                      <span className="font-medium">Custom Environments</span>
                      <p className="text-sm text-muted-foreground">
                        Display cards in premium viewing environments
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500/10 p-1 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div>
                      <span className="font-medium">Interactive Controls</span>
                      <p className="text-sm text-muted-foreground">
                        Intuitive keyboard shortcuts and touch controls
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500/10 p-1 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div>
                      <span className="font-medium">Card Details</span>
                      <p className="text-sm text-muted-foreground">
                        View complete card metadata and statistics
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>
                    <span className="font-medium">Mouse:</span> Drag to rotate and move the card
                  </p>
                  <p>
                    <span className="font-medium">Click:</span> Flip the card to see the back
                  </p>
                  <p>
                    <span className="font-medium">Arrow Keys:</span> Navigate between cards
                  </p>
                  <p>
                    <span className="font-medium">F Key:</span> Flip card (front/back)
                  </p>
                  <p>
                    <span className="font-medium">R Key:</span> Reset card position
                  </p>
                  <p>
                    <span className="font-medium">B Key:</span> Change background style
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
      
      {/* Immersive Viewer */}
      <ImmersiveCardViewer
        isOpen={isViewerOpen}
        cardId={id}
        onClose={closeViewer}
      />
    </PageLayout>
  );
};

export default ImmersiveCardViewerDemo;
