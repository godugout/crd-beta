
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import GroupImageUploader from '@/components/group-memory/GroupImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommentSection from '@/components/CommentSection';
import useImageProcessing from '@/hooks/useImageProcessing';
import { toast } from 'sonner';

const GroupMemoryCreator = () => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [processedImages, setProcessedImages] = useState<Array<{url: string, id: string}>>([]);
  const { isProcessing } = useImageProcessing();
  
  const handleProcessingComplete = (cardIds: string[]) => {
    if (cardIds.length > 0) {
      // Convert card IDs to a format we can use for display
      const newImages = cardIds.map(id => ({
        id,
        url: `/images/card-placeholder.png` // Fallback to placeholder image
      }));
      
      setProcessedImages([...processedImages, ...newImages]);
      setActiveTab("results");
      toast.success(`Successfully processed ${cardIds.length} images`);
    }
  };

  return (
    <PageLayout
      title="Group Memory Creator"
      description="Capture and preserve group experiences at the Coliseum"
    >
      <main className="pt-6 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <Link to="/teams/oakland/memories">
            <Button variant="ghost" className="mb-4 -ml-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Memories
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#003831]">Group Memory Creator</h1>
              <p className="text-gray-600 mt-2">
                Capture and preserve group experiences at the Coliseum and beyond
              </p>
            </div>
            
            <div className="h-16 w-16">
              <img 
                src="/oakland/oak-fan-logo.png" 
                alt="Oakland A's" 
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          
          <div className="h-1 bg-gradient-to-r from-[#003831] via-[#006341] to-[#EFB21E] mt-4"></div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="results" disabled={processedImages.length === 0}>Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="bg-white p-6 rounded-lg shadow-sm">
            <GroupImageUploader 
              onComplete={handleProcessingComplete} 
              className="max-w-4xl mx-auto"
            />
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            {processedImages.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">Processed Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {processedImages.map((image, index) => (
                    <div key={image.id || index} className="aspect-square rounded-lg border overflow-hidden">
                      <img 
                        src={image.url} 
                        alt={`Processed image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <CommentSection />
          </TabsContent>
        </Tabs>
      </main>
    </PageLayout>
  );
};

export default GroupMemoryCreator;
