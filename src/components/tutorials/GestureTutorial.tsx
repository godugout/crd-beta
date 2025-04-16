
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MousePointerClick, PanelRightOpen, Fingerprint, Hand, RotateCw, ZoomIn } from 'lucide-react';

interface GestureTutorialProps {
  open: boolean;
  onClose: () => void;
}

const GestureTutorial: React.FC<GestureTutorialProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('touch');
  const [hasShownBefore, setHasShownBefore] = useState(false);

  // Check if tutorial has been shown before
  useEffect(() => {
    const tutorialShown = localStorage.getItem('cardShowGestureTutorialShown');
    setHasShownBefore(tutorialShown === 'true');
  }, []);

  // Save to localStorage when tutorial is closed
  const handleClose = () => {
    localStorage.setItem('cardShowGestureTutorialShown', 'true');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Card Interaction Controls</DialogTitle>
          <DialogDescription>
            Learn how to interact with cards using touch, gestures, and device motion.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="touch">
              <Hand className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Touch</span>
            </TabsTrigger>
            <TabsTrigger value="gestures">
              <Fingerprint className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Gestures</span>
            </TabsTrigger>
            <TabsTrigger value="motion">
              <RotateCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Motion</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="touch" className="space-y-4 mt-4">
            <div className="flex gap-4 items-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-center">
                <MousePointerClick className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Basic Touches</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tap once to select a card. Double-tap to reset the card's position and rotation.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-center">
                <PanelRightOpen className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Edge Swipes</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Swipe from the edge of a card to flip it over. The card will respond with haptic feedback.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gestures" className="space-y-4 mt-4">
            <div className="flex gap-4 items-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Pinch & Zoom</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Use two fingers to pinch in or out to zoom. The card will smoothly scale with your gesture.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-center">
                <RotateCw className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Twist Rotation</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Use two fingers and rotate them to spin the card. This gives you full control of the card's orientation.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="motion" className="space-y-4 mt-4">
            <div className="flex gap-4 items-start">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
                <div className="transform rotate-45 mb-2">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500" />
                    <path d="M20 12H4M4 12L8 8M4 12L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm">Device Motion</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tilt your device to control the card's rotation. The card follows your device's movement for an immersive experience.
                </p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                  try {
                    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
                      (DeviceMotionEvent as any).requestPermission();
                    }
                  } catch (e) {
                    console.log('Device motion not available or already permitted');
                  }
                }}>
                  Enable Motion Controls
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="secondary" onClick={handleClose}>
            {hasShownBefore ? 'Close' : 'Got it!'}
          </Button>
          {!hasShownBefore && (
            <div className="text-xs text-gray-500 text-center sm:text-right">
              This tutorial will only show once. You can access it again from the settings menu.
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GestureTutorial;
