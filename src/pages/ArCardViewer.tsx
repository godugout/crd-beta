
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { useArCardViewer } from '@/hooks/useArCardViewer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Camera, RefreshCw, ZoomIn, ZoomOut, RotateCw, ArrowLeft } from 'lucide-react';
import '../components/home/card-effects/index.css';

const ArCardViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('webAR');
  
  const {
    activeCard,
    isArMode,
    isFlipped,
    scale,
    rotation,
    cameraError,
    isLoading,
    handleLaunchAr,
    handleExitAr,
    handleCameraError,
    handleTakeSnapshot,
    handleFlip,
    handleZoomIn,
    handleZoomOut,
    handleRotate
  } = useArCardViewer(id);
  
  if (isLoading) {
    return (
      <PageLayout title="Loading AR Viewer..." description="Loading your card for AR view">
        <div className="container mx-auto py-8 max-w-5xl">
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading card data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!activeCard) {
    return (
      <PageLayout title="Card Not Found" description="The requested card could not be found">
        <div className="container mx-auto py-8 max-w-5xl">
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-muted-foreground mb-4">The card could not be found.</p>
            <Button onClick={() => navigate('/gallery')}>Return to Gallery</Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout 
      title={`AR Viewer: ${activeCard.title}`} 
      description="View your cards in augmented reality"
    >
      <div className="container mx-auto py-8 max-w-5xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{activeCard.title}</h1>
          <p className="text-muted-foreground">AR Card Viewer</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="webAR">Web AR</TabsTrigger>
            <TabsTrigger value="nativeAR">Native AR</TabsTrigger>
          </TabsList>
          
          <TabsContent value="webAR">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {/* AR Preview Area */}
                <div 
                  className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden"
                  style={{
                    minHeight: '400px'
                  }}
                >
                  {isArMode ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Simulated webcam background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                      
                      {/* Card with applied effects */}
                      <div 
                        className="relative aspect-[2.5/3.5] w-64 transition-all duration-300"
                        style={{
                          transform: `scale(${scale / 100}) rotate(${rotation}deg)${isFlipped ? ' rotateY(180deg)' : ''}`,
                          transformOrigin: 'center',
                        }}
                      >
                        <div className={`relative w-full h-full effect-holographic ${isFlipped ? 'flipped' : ''}`}>
                          <img 
                            src={activeCard.imageUrl} 
                            alt={activeCard.title} 
                            className="w-full h-full object-cover rounded-lg effect-shimmer"
                          />
                        </div>
                      </div>
                      
                      {/* Capture button */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <Button
                          variant="default"
                          size="icon"
                          className="rounded-full h-12 w-12 bg-white text-black hover:bg-gray-100"
                          onClick={handleTakeSnapshot}
                        >
                          <Camera className="h-6 w-6" />
                        </Button>
                      </div>
                      
                      {/* Controls for manipulating card */}
                      <div className="absolute top-4 right-4 space-y-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-full"
                          onClick={handleFlip}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-full"
                          onClick={handleZoomIn}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-full"
                          onClick={handleZoomOut}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-full"
                          onClick={handleRotate}
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Exit AR button */}
                      <Button
                        variant="outline"
                        className="absolute top-4 left-4"
                        onClick={handleExitAr}
                      >
                        Exit AR
                      </Button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <img 
                        src={activeCard.imageUrl} 
                        alt={activeCard.title} 
                        className="w-40 h-56 object-cover rounded-lg shadow-lg mb-6"
                      />
                      
                      <h2 className="text-white text-xl font-bold mb-2">{activeCard.title}</h2>
                      <p className="text-gray-300 mb-6 text-center">
                        {cameraError ? (
                          <>
                            <span className="block text-red-400 font-medium">Camera Error</span>
                            {cameraError}
                          </>
                        ) : (
                          "View this card in augmented reality"
                        )}
                      </p>
                      
                      <Button
                        size="lg"
                        onClick={handleLaunchAr}
                        disabled={!!cameraError}
                      >
                        Launch Web AR
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Web AR Instructions</h2>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Click "Launch Web AR" to start the AR experience</li>
                    <li>Allow camera access when prompted</li>
                    <li>Place your card in a well-lit area</li>
                    <li>Use the controls to flip, zoom, or rotate the card</li>
                    <li>Click the camera button to take a snapshot</li>
                  </ol>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-2">Card Details</h2>
                  <p className="text-muted-foreground mb-4">{activeCard.description}</p>
                  
                  {activeCard.tags && activeCard.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {activeCard.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="nativeAR">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
              <h2 className="text-xl font-bold mb-4">Native AR Experience</h2>
              <p className="text-muted-foreground mb-6">
                For the full AR experience, download our mobile app and scan the QR code below.
              </p>
              
              <div className="bg-white w-48 h-48 mx-auto mb-6 flex items-center justify-center rounded">
                <div className="text-sm text-gray-400">QR Code Placeholder</div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button variant="outline">iOS App</Button>
                <Button variant="outline">Android App</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ArCardViewer;
