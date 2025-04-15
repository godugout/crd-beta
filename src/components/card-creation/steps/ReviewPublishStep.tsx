
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, Share2, Download } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReviewPublishStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  completeStep: () => void;
}

const ReviewPublishStep: React.FC<ReviewPublishStepProps> = ({
  formData,
  updateFormData,
  completeStep
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Handle share functionality
  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${formData.playerName} Baseball Card`,
          text: `Check out this digital baseball card of ${formData.playerName} I created!`,
          // url would be the actual URL to the published card
          url: window.location.href,
        });
        toast.success("Card shared successfully!");
      } else {
        // Fallback for browsers that don't support the Web Share API
        toast.info("Sharing not supported on this browser");
      }
    } catch (error) {
      console.error("Error sharing card:", error);
    } finally {
      setIsSharing(false);
    }
  };
  
  // Handle download functionality (mock)
  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      toast.success("Card downloaded successfully!");
      setIsDownloading(false);
    }, 1500);
  };
  
  // Auto-complete step
  React.useEffect(() => {
    completeStep();
  }, [completeStep]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Publish</h2>
        <p className="text-gray-500 text-sm">
          Review your card details before publishing.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4">Card Preview</h3>
            
            <div className="flex-grow flex items-center justify-center">
              {formData.imageUrl ? (
                <div className="relative max-w-xs w-full aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-lg border-4 border-white">
                  <img 
                    src={formData.imageUrl} 
                    alt={formData.playerName || "Card preview"} 
                    className="w-full h-full object-cover"
                  />
                  {formData.playerName && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h4 className="text-white font-bold text-xl">{formData.playerName}</h4>
                      <p className="text-white/80 text-sm">
                        {formData.team}{formData.year ? ` • ${formData.year}` : ''}
                      </p>
                      {formData.position && (
                        <Badge className="mt-2 bg-blue-500">{formData.position}</Badge>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No image uploaded</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex gap-3 justify-center">
              <Button
                onClick={handleShare}
                disabled={isSharing}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Share2 className="h-4 w-4" />
                {isSharing ? "Sharing..." : "Share"}
              </Button>
              
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download"}
              </Button>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Card Details Summary</h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="player-details">
                <AccordionTrigger className="text-sm font-medium">Player Information</AccordionTrigger>
                <AccordionContent>
                  <dl className="space-y-2 text-sm">
                    <div className="grid grid-cols-3">
                      <dt className="font-medium">Name:</dt>
                      <dd className="col-span-2">{formData.playerName || "Not specified"}</dd>
                    </div>
                    <div className="grid grid-cols-3">
                      <dt className="font-medium">Team:</dt>
                      <dd className="col-span-2">{formData.team || "Not specified"}</dd>
                    </div>
                    <div className="grid grid-cols-3">
                      <dt className="font-medium">Position:</dt>
                      <dd className="col-span-2">{formData.position || "Not specified"}</dd>
                    </div>
                    <div className="grid grid-cols-3">
                      <dt className="font-medium">Year:</dt>
                      <dd className="col-span-2">{formData.year || "Not specified"}</dd>
                    </div>
                    <div className="grid grid-cols-3">
                      <dt className="font-medium">Sport:</dt>
                      <dd className="col-span-2">{formData.sport || "Baseball"}</dd>
                    </div>
                  </dl>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="stats">
                <AccordionTrigger className="text-sm font-medium">Statistics</AccordionTrigger>
                <AccordionContent>
                  {formData.stats && Object.keys(formData.stats).length > 0 ? (
                    <dl className="space-y-2 text-sm">
                      {Object.entries(formData.stats).map(([key, value]: [string, any]) => (
                        <div key={key} className="grid grid-cols-3">
                          <dt className="font-medium">{key.toUpperCase()}:</dt>
                          <dd className="col-span-2">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-sm text-gray-500">No statistics added</p>
                  )}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="template">
                <AccordionTrigger className="text-sm font-medium">Template & Effects</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-3">
                      <dt className="font-medium">Template:</dt>
                      <dd className="col-span-2">{formData.templateName || "Default template"}</dd>
                    </div>
                    
                    <dt className="font-medium">Effects:</dt>
                    {formData.effects && Object.keys(formData.effects).length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.values(formData.effects).map((effect: any) => (
                          <Badge key={effect.id} variant="outline" className="bg-white">
                            {effect.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <dd className="mt-1 text-gray-500">No effects added</dd>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="tags">
                <AccordionTrigger className="text-sm font-medium">Tags & Metadata</AccordionTrigger>
                <AccordionContent>
                  {formData.tags && formData.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="bg-gray-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No tags added</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
          
          <Card className="p-4 mt-4 bg-green-50 border border-green-100">
            <h3 className="text-sm font-medium text-green-700">Publishing Information</h3>
            <p className="text-xs text-green-600 mt-2">
              Your card will be published to your personal collection and can be shared with others.
              You can always edit or delete it later.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReviewPublishStep;
