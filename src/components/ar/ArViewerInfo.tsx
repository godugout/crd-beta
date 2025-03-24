
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Smartphone } from 'lucide-react';

interface ArViewerInfoProps {
  cameraError: string | null;
}

const ArViewerInfo: React.FC<ArViewerInfoProps> = ({ cameraError }) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Augmented Reality Card Viewer</h1>
      <p className="text-gray-600 mb-8">
        Experience your trading cards in augmented reality. Place multiple cards in the real world, position them with touch gestures, and share the experience with friends.
      </p>
      
      {cameraError ? (
        <Alert className="mb-8 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Camera Error</AlertTitle>
          <AlertDescription className="text-red-700">
            {cameraError}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-8 bg-amber-50 border-amber-200">
          <Smartphone className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Ready for AR</AlertTitle>
          <AlertDescription className="text-amber-700">
            Camera access will be requested when you launch the AR experience. You'll be able to place multiple cards and position them with touch gestures.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ArViewerInfo;
