
import React from 'react';
import { Users, Camera } from 'lucide-react';
import { MobileTouchButton } from '@/components/ui/mobile-controls';

interface UploadActionsProps {
  batchProcessingEnabled: boolean;
  batchMode: boolean;
  toggleBatchMode: () => void;
  handleCameraCapture: () => void;
  isMobile: boolean;
}

const UploadActions: React.FC<UploadActionsProps> = ({
  batchProcessingEnabled,
  batchMode,
  toggleBatchMode,
  handleCameraCapture,
  isMobile
}) => {
  return (
    <div className="mt-4 flex flex-wrap gap-3 justify-center">
      {batchProcessingEnabled && (
        <MobileTouchButton
          onClick={toggleBatchMode}
          className="flex items-center gap-2"
          size="lg"
          variant={batchMode ? "default" : "secondary"}
          hapticFeedback={false}
        >
          <Users className="h-5 w-5" />
          {batchMode ? 'Batch Mode On' : 'Batch Processing'}
        </MobileTouchButton>
      )}
      
      {isMobile && (
        <MobileTouchButton
          onClick={handleCameraCapture}
          className="flex items-center gap-2"
          size="lg"
          hapticFeedback={false}
        >
          <Camera className="h-5 w-5" />
          Take a Photo
        </MobileTouchButton>
      )}
    </div>
  );
};

export default UploadActions;
