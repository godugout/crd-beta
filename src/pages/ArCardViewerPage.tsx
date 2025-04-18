
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { useArCardViewer } from '@/hooks/useArCardViewer';
import { 
  ArrowLeft, 
  Camera, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Plus,
  XCircle
} from 'lucide-react';
import { Card } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ArCardViewerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [showAddCardSheet, setShowAddCardSheet] = useState(false);
  const { 
    cards,
    loading,
    error,
    activeCard,
    arCards,
    availableCards,
    isArMode,
    isFlipped,
    handleLaunchAr,
    handleExitAr,
    handleCameraError,
    handleTakeSnapshot,
    handleFlip,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    handleAddCard,
    handleRemoveCard,
  } = useArCardViewer(id);

  // Start camera when entering AR mode
  useEffect(() => {
    if (isArMode) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isArMode]);

  // Start the camera feed
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error('Error accessing camera:', error);
      if ((error as Error).name === 'NotAllowedError') {
        setIsPermissionDenied(true);
      }
      handleCameraError((error as Error).message);
    }
  };

  // Stop the camera feed
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  if (loading) {
    return (
      <PageLayout title="AR Card Viewer" description="Loading AR experience...">
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-t-blue-500 border-blue-300/30 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-medium mb-2">Preparing AR Experience</h3>
            <p className="text-gray-500">Loading card data and AR components...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="AR Card Viewer" description="Error loading AR experience">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Error Loading AR Experience</h2>
            <p className="text-red-500 mb-8">{error.message}</p>
            <Button onClick={() => navigate('/cards')}>
              Back to Cards
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Main AR Experience
  return (
    <PageLayout 
      title="AR Card Viewer" 
      description="View cards in augmented reality"
      className="bg-black"
    >
      <div className="relative min-h-[calc(100vh-64px)]">
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <Button 
            variant="ghost" 
            className="text-white" 
            onClick={() => {
              handleExitAr();
              navigate(-1);
            }}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          
          {isArMode && (
            <Button 
              variant="outline" 
              className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
              onClick={handleTakeSnapshot}
            >
              <Camera className="h-4 w-4 mr-2" />
              Capture
            </Button>
          )}
        </div>
        
        {/* Camera Background */}
        {isArMode && (
          <div className="absolute inset-0 z-0">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted
            />
          </div>
        )}
        
        {/* Non-AR Background */}
        {!isArMode && (
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
              <div className="w-3/4 max-w-md">
                <div className="relative aspect-[3/4]">
                  {activeCard && (
                    <img 
                      src={activeCard.imageUrl} 
                      alt={activeCard.title}
                      className="w-full h-full object-contain rounded-lg shadow-2xl shadow-purple-700/20"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
          {!isArMode && activeCard && (
            <div className="bg-gray-900/70 backdrop-blur-sm p-6 rounded-lg text-center max-w-sm">
              <h2 className="text-xl font-bold mb-4">{activeCard.title}</h2>
              
              {activeCard.description && (
                <p className="text-gray-300 mb-6">{activeCard.description}</p>
              )}
              
              <Button 
                onClick={() => handleLaunchAr()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                View in AR
              </Button>
            </div>
          )}
        </div>
        
        {/* Bottom Controls */}
        {isArMode && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
            {/* Card Selection Carousel */}
            <div className="mb-4 overflow-x-auto flex gap-2 pb-2">
              {arCards.map((card) => (
                <div key={card.id} className="relative flex-shrink-0 w-20 h-28 rounded-md overflow-hidden">
                  <img 
                    src={card.thumbnailUrl || card.imageUrl} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="absolute top-1 right-1 w-5 h-5 p-0"
                    onClick={() => handleRemoveCard(card.id)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {/* Add Card Button */}
              <Button 
                variant="outline" 
                className="flex-shrink-0 w-20 h-28 flex flex-col items-center justify-center bg-gray-800/50 border-dashed border-gray-600"
                onClick={() => setShowAddCardSheet(true)}
              >
                <Plus className="h-6 w-6 mb-1" />
                <span className="text-xs">Add Card</span>
              </Button>
            </div>
            
            {/* Interaction Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="icon"
                variant="outline"
                className="border-white/30 bg-white/10 backdrop-blur-md text-white rounded-full h-12 w-12"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              
              <Button
                size="icon"
                variant="outline"
                className="border-white/30 bg-white/10 backdrop-blur-md text-white rounded-full h-12 w-12"
                onClick={handleFlip}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
              
              <Button
                size="icon"
                variant="outline"
                className="border-white/30 bg-white/10 backdrop-blur-md text-white rounded-full h-16 w-16"
                onClick={handleTakeSnapshot}
              >
                <Camera className="h-7 w-7" />
              </Button>
              
              <Button
                size="icon"
                variant="outline"
                className="border-white/30 bg-white/10 backdrop-blur-md text-white rounded-full h-12 w-12"
                onClick={handleRotate}
              >
                <RotateCw className="h-5 w-5" />
              </Button>
              
              <Button
                size="icon"
                variant="outline"
                className="border-white/30 bg-white/10 backdrop-blur-md text-white rounded-full h-12 w-12"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Permission Denied Dialog */}
        <AlertDialog open={isPermissionDenied}>
          <AlertDialogContent>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Camera Access Denied</h2>
              <p className="mb-6">
                To use the AR features, you need to allow camera access. Please update your browser settings and try again.
              </p>
              <div className="flex justify-end">
                <Button onClick={() => {
                  setIsPermissionDenied(false);
                  navigate(-1);
                }}>
                  Go Back
                </Button>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Add Card Sheet */}
        <Sheet open={showAddCardSheet} onOpenChange={setShowAddCardSheet}>
          <SheetContent side="bottom" className="h-[400px]">
            <SheetHeader>
              <SheetTitle>Add Card to AR Scene</SheetTitle>
            </SheetHeader>
            
            <div className="py-6">
              {availableCards.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No more cards available to add
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {availableCards.map(card => (
                    <div 
                      key={card.id}
                      className="relative cursor-pointer"
                      onClick={() => {
                        handleAddCard(card.id);
                        setShowAddCardSheet(false);
                        toast({
                          title: "Card added",
                          description: `${card.title} added to AR scene`
                        });
                      }}
                    >
                      <div className="aspect-[3/4] rounded-md overflow-hidden border border-gray-700">
                        <img 
                          src={card.thumbnailUrl || card.imageUrl} 
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-1 text-xs truncate">{card.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <SheetFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowAddCardSheet(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </PageLayout>
  );
};

export default ArCardViewerPage;
