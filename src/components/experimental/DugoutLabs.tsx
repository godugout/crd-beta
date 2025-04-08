
import React, { useState } from 'react';
import { FlaskConical, X, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import CardDetectionTrainer from './CardTrainer/CardDetectionTrainer';
import { useNavigate } from 'react-router-dom';

enum LabExperiment {
  CARD_DETECTION = 'card-detection',
  PBR_RENDERING = 'pbr-rendering',
  SIGNATURE_ANALYZER = 'signature-analyzer',
  NONE = 'none'
}

const DugoutLabs = () => {
  const [currentExperiment, setCurrentExperiment] = useState<LabExperiment>(LabExperiment.NONE);
  const navigate = useNavigate();

  const handleNavigateToLabs = () => {
    navigate('/labs');
  };

  const renderExperiment = () => {
    switch (currentExperiment) {
      case LabExperiment.CARD_DETECTION:
        return <CardDetectionTrainer />;
      default:
        return (
          <div className="p-6 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="bg-amber-100 rounded-full p-6 inline-flex">
              <FlaskConical className="h-12 w-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold">Welcome to Dugout Labs</h3>
            <p className="text-muted-foreground max-w-md">
              This is where we experiment with new features and improvements.
              Choose an experiment from the options below or explore all labs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mt-6">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center justify-center"
                onClick={() => setCurrentExperiment(LabExperiment.CARD_DETECTION)}
              >
                <span className="font-medium mb-1">Card Detection Trainer</span>
                <span className="text-xs text-muted-foreground">Help improve auto-detection of cards by tracing them</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center justify-center"
                onClick={() => navigate('/labs/pbr')}
              >
                <span className="font-medium mb-1">PBR Rendering</span>
                <span className="text-xs text-muted-foreground">Experience physically-based rendering for cards</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center justify-center"
                onClick={() => navigate('/labs/signature')}
              >
                <span className="font-medium mb-1">Signature Analyzer</span>
                <span className="text-xs text-muted-foreground">Analyze and authenticate player signatures</span>
              </Button>
              
              <Button 
                variant="default" 
                className="h-auto p-4 flex flex-col items-center justify-center bg-amber-500 hover:bg-amber-600"
                onClick={handleNavigateToLabs}
              >
                <span className="font-medium mb-1 flex items-center">
                  View All Labs <LinkIcon className="h-4 w-4 ml-2" />
                </span>
                <span className="text-xs opacity-80">Explore the full labs gallery</span>
              </Button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800"
        >
          <FlaskConical className="h-4 w-4" />
          Dugout Labs
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-3xl w-full p-0 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b">
          <SheetHeader className="p-6 pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-amber-500" />
                <SheetTitle>Dugout Labs</SheetTitle>
              </div>
              
              {currentExperiment !== LabExperiment.NONE && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCurrentExperiment(LabExperiment.NONE)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Back to Labs
                </Button>
              )}
            </div>
            <SheetDescription>
              Experimental features and UX improvements
            </SheetDescription>
          </SheetHeader>
        </div>
        
        <div className="min-h-[500px]">
          {renderExperiment()}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DugoutLabs;
