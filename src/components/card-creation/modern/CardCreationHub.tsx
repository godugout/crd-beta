
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Settings, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CardUploadStep from '../steps/CardUploadStep';
import UnifiedImageProcessingPanel from '@/components/image-processing/UnifiedImageProcessingPanel';

interface CardCreationHubProps {
  onSave: (cardData: any) => Promise<void>;
  isEditing?: boolean;
  initialData?: any;
}

const CardCreationHub: React.FC<CardCreationHubProps> = ({
  onSave,
  isEditing = false,
  initialData
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showImageProcessor, setShowImageProcessor] = useState(false);
  
  const [cardData, setCardData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    backImageUrl: initialData?.backImageUrl || '',
    player: initialData?.metadata?.player || '',
    team: initialData?.metadata?.team || '',
    year: initialData?.metadata?.year || '',
    tags: initialData?.tags || [],
    ...initialData
  });

  const handleContinue = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/gallery');
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleImageUpdate = (newImageUrl: string) => {
    setCardData(prev => ({ ...prev, imageUrl: newImageUrl }));
  };

  const handleSave = async () => {
    try {
      await onSave(cardData);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const stepTitles = [
    'Upload',
    'Design', 
    'Effects',
    'Preview'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {currentStep === 0 ? 'Gallery' : 'Back'}
              </Button>
              
              <div className="text-white">
                <h1 className="text-xl font-bold">
                  {isEditing ? 'Edit Card' : 'Create New Card'}
                </h1>
                <p className="text-sm text-gray-300">
                  Step {currentStep + 1} of {stepTitles.length}: {stepTitles[currentStep]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {cardData.imageUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageProcessor(true)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Edit Image
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview 3D
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentStep === 0 && (
          <CardUploadStep
            cardData={cardData}
            setCardData={setCardData}
            onContinue={handleContinue}
          />
        )}
        
        {currentStep === 1 && (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Design Step</h2>
            <p>Design tools coming soon...</p>
            <Button onClick={handleContinue} className="mt-4">
              Continue
            </Button>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Effects Step</h2>
            <p>Effect tools coming soon...</p>
            <Button onClick={handleContinue} className="mt-4">
              Continue
            </Button>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Preview & Save</h2>
            <p className="mb-4">Your card is ready!</p>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Save Card
            </Button>
          </div>
        )}
      </div>

      {/* Image Processing Panel */}
      {showImageProcessor && cardData.imageUrl && (
        <UnifiedImageProcessingPanel
          imageUrl={cardData.imageUrl}
          onImageUpdate={handleImageUpdate}
          onClose={() => setShowImageProcessor(false)}
        />
      )}
    </div>
  );
};

export default CardCreationHub;
