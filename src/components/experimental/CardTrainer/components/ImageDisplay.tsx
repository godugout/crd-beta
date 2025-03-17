
import React from 'react';
import { Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ImageDisplayProps {
  image: string | null;
  imageRef: React.RefObject<HTMLImageElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  displayWidth: number;
  displayHeight: number;
  onUploadClick: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  image,
  imageRef,
  canvasRef,
  displayWidth,
  displayHeight,
  onUploadClick
}) => {
  // Configure UI based on screen size
  const useSmallScreen = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const OverlayContainer = useSmallScreen ? Drawer : Dialog;
  const OverlayTrigger = useSmallScreen ? DrawerTrigger : DialogTrigger;
  const OverlayContent = useSmallScreen ? DrawerContent : DialogContent;

  if (!image) {
    return (
      <div className="border rounded-lg overflow-hidden bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="bg-neutral-200 rounded-full p-4 mb-4">
            <Upload className="h-8 w-8 text-neutral-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Upload an image</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            Upload an image containing trading cards to trace and improve the detection algorithm
          </p>
          <Button 
            variant="outline" 
            onClick={onUploadClick}
          >
            Choose Image
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-neutral-50 flex items-center justify-center relative">
      <img 
        ref={imageRef}
        src={image} 
        alt="Card detection" 
        className="hidden"
      />
      <canvas 
        ref={canvasRef} 
        className="max-w-full"
        style={{ 
          width: displayWidth > 0 ? displayWidth : 'auto',
          height: displayHeight > 0 ? displayHeight : 'auto'
        }}
      />
      <div className="absolute top-4 right-4">
        <OverlayContainer>
          <OverlayTrigger asChild>
            <Button size="icon" variant="outline" className="rounded-full bg-white/80">
              <Maximize className="h-4 w-4" />
            </Button>
          </OverlayTrigger>
          <OverlayContent className="max-w-full w-full h-[90vh] max-h-[90vh] flex items-center justify-center">
            <div className="w-full h-full overflow-auto flex items-center justify-center">
              <canvas 
                width={displayWidth} 
                height={displayHeight}
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
                className="border"
              />
            </div>
          </OverlayContent>
        </OverlayContainer>
      </div>
    </div>
  );
};

export default ImageDisplay;
