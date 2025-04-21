import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import ImageEditor from '../card-upload/ImageEditor';
import PageLayout from '../navigation/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemorabiliaType } from '../card-upload/cardDetection';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const CardDetectorPage = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editorImage, setEditorImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [detectionResults, setDetectionResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Enable all memorabilia types
  const enabledMemorabiliaTypes: MemorabiliaType[] = [
    'card', 'ticket', 'program', 'autograph', 'face', 'group', 'unknown'
  ];
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsLoading(true);
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setEditorImage(e.target.result as string);
          setCurrentFile(file);
          setShowEditor(true);
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        toast.error("Failed to load image");
        setIsLoading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleCropComplete = (file: File, url: string, memorabiliaType?: MemorabiliaType, metadata?: any) => {
    setShowEditor(false);
    setDetectionResults({ file, url, memorabiliaType, metadata });
    setActiveTab('results');
    console.log('Crop complete with metadata:', metadata);
  };

  const handleCreateCard = () => {
    if (!detectionResults) {
      toast.error("No card detected to edit");
      return;
    }

    // Navigate to card editor with the extracted data
    navigate("/cards/create", {
      state: {
        imageUrl: detectionResults.url,
        file: detectionResults.file,
        metadata: detectionResults.metadata,
        cardType: detectionResults.memorabiliaType
      }
    });
  };
  
  return (
    <PageLayout title="Card Detector" description="Detect and analyze cards">
      <div className="container max-w-6xl mx-auto pt-6 px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Card Detector</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="results" disabled={!detectionResults}>Results</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload">
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                      <p className="text-gray-500 mb-4">Upload a card or memorabilia item to analyze</p>
                      <div>
                        <Button variant="default" disabled={isLoading}>
                          <label htmlFor="file-upload" className="cursor-pointer flex items-center">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Select Image
                            <input
                              id="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleFileSelect}
                              disabled={isLoading}
                            />
                          </label>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="results">
                    {detectionResults && (
                      <div className="space-y-4">
                        <img 
                          src={detectionResults.url} 
                          alt="Detected card" 
                          className="mx-auto max-h-96 object-contain rounded-lg border"
                        />
                        <div className="bg-white p-4 rounded-lg border">
                          <h3 className="font-medium mb-2">Detection Results</h3>
                          <dl className="grid grid-cols-2 gap-2">
                            <dt className="text-gray-600">Type:</dt>
                            <dd>{detectionResults.memorabiliaType || 'Unknown'}</dd>
                            <dt className="text-gray-600">Title:</dt>
                            <dd>{detectionResults.metadata?.title || 'Not detected'}</dd>
                            <dt className="text-gray-600">Year:</dt>
                            <dd>{detectionResults.metadata?.year || 'Not detected'}</dd>
                          </dl>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => setActiveTab('upload')}
                            variant="outline"
                          >
                            Upload Another
                          </Button>
                          <Button 
                            onClick={handleCreateCard}
                            variant="default"
                          >
                            Create Card
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle>Detection Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Detection Confidence</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {detectionResults?.metadata?.confidence || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  <p className="mb-2">The AI has analyzed your card and extracted information including:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Card dimensions and borders</li>
                    <li>Text and player information</li>
                    <li>Team and year data</li>
                  </ul>
                </div>
                
                {detectionResults && (
                  <Button 
                    className="w-full"
                    onClick={handleCreateCard}
                  >
                    Create Card
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Wrap ImageEditor in Suspense to handle async loading */}
      <Suspense fallback={<div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
          <p className="text-center">Loading editor...</p>
        </div>
      </div>}>
        <ImageEditor
          showEditor={showEditor}
          setShowEditor={setShowEditor}
          editorImage={editorImage}
          currentFile={currentFile}
          onCropComplete={handleCropComplete}
          enabledMemorabiliaTypes={enabledMemorabiliaTypes}
          autoEnhance={true}
        />
      </Suspense>
    </PageLayout>
  );
};

export default CardDetectorPage;
