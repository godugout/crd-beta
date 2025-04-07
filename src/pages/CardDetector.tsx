
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { CropIcon, ChevronRight, Upload, SaveAll, X, Users, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImageEditor } from '@/components/card-upload';
import { useCards } from '@/context/CardContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OaklandMemorySearch } from '@/components/oakland/gallery';

const CardDetector = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [editorImage, setEditorImage] = useState<string | null>(null);
  const [detectionMode, setDetectionMode] = useState<'individual' | 'group'>('individual');
  const [searchTerm, setSearchTerm] = useState('');
  const { addCard } = useCards();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      setCurrentFile(file);
      const imageUrl = URL.createObjectURL(file);
      setEditorImage(imageUrl);
      setShowEditor(true);
    } else {
      toast.error('Please upload an image file');
    }
  };

  const handleCropComplete = (croppedFile: File, croppedUrl: string) => {
    // Create card object matching the expected Card type structure
    const newCard = {
      title: croppedFile.name.split('.')[0] || 'New Card',
      description: detectionMode === 'group' 
        ? 'Group photo detected with Card Detector'
        : 'Person detected with Card Detector',
      imageUrl: croppedUrl,
      thumbnailUrl: croppedUrl,
      tags: ['card detector', detectionMode === 'group' ? 'group photo' : 'individual', 'auto-detected'],
      userId: 'dev-user-id',
      isPublic: false
    };

    addCard(newCard);
    
    toast.success('Card added to your gallery!', {
      description: 'Your detected card has been successfully added'
    });
  };

  const handleBatchProcessing = (files: File[], urls: string[]) => {
    if (files.length === 0) return;
    
    let processedCount = 0;
    
    files.forEach((file, index) => {
      const newCard = {
        title: `Person ${index + 1}`,
        description: 'Detected from batch processing with Card Detector',
        imageUrl: urls[index],
        thumbnailUrl: urls[index],
        tags: ['card detector', 'batch processed', 'auto-detected'],
        userId: 'dev-user-id',
        isPublic: false
      };

      addCard(newCard).then(() => {
        processedCount++;
        if (processedCount === files.length) {
          toast.success(`${files.length} cards added to your gallery!`);
        }
      });
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center text-sm text-gray-500 py-4">
            <Link to="/" className="hover:text-cardshow-blue">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-cardshow-dark font-medium">Card Detector</span>
          </div>
          
          <div className="py-6">
            <div className="flex items-center gap-3 mb-2">
              <CropIcon className="h-6 w-6 text-cardshow-blue" />
              <h1 className="text-3xl font-bold text-cardshow-dark">Card Detector</h1>
            </div>
            <p className="text-cardshow-slate mb-8">
              Upload an image containing people or trading cards to automatically detect, crop, and add them to your gallery
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload & Detect</TabsTrigger>
                  <TabsTrigger value="settings">Detection Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload">
                  {!showEditor ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="bg-blue-50 p-6 rounded-full mb-6">
                        <Upload className="h-12 w-12 text-cardshow-blue" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">Upload an image with {detectionMode === 'group' ? 'people' : 'a person or card'}</h2>
                      <p className="text-cardshow-slate text-center max-w-md mb-6">
                        {detectionMode === 'group' 
                          ? 'Upload a group photo, and we'll automatically detect faces and let you create cards for each person.'
                          : 'Upload an image containing a person or trading card, and we'll automatically detect and extract it for you.'}
                      </p>
                      <Button
                        size="lg"
                        className="relative"
                        onClick={() => document.getElementById('card-upload')?.click()}
                      >
                        {detectionMode === 'group' ? 'Upload Group Photo' : 'Select Image'}
                        <input
                          id="card-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                          {detectionMode === 'group' ? 'Detected People' : 'Detected Cards'}
                        </h2>
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById('card-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Another Image
                          <input
                            id="card-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </Button>
                      </div>
                      
                      <div className="text-sm text-cardshow-slate mb-4">
                        <p>Use the editor to adjust the selection boxes around each detected {detectionMode === 'group' ? 'person' : 'card'}.</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="space-y-6 py-4">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Detection Mode</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div 
                          className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            detectionMode === 'individual' 
                              ? 'border-cardshow-blue bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setDetectionMode('individual')}
                        >
                          <UserRound className={`h-8 w-8 mb-2 ${detectionMode === 'individual' ? 'text-cardshow-blue' : 'text-gray-400'}`} />
                          <h4 className="font-medium">Individual Mode</h4>
                          <p className="text-xs text-center text-gray-500 mt-1">Best for single cards or portraits</p>
                        </div>
                        <div 
                          className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            detectionMode === 'group' 
                              ? 'border-cardshow-blue bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setDetectionMode('group')}
                        >
                          <Users className={`h-8 w-8 mb-2 ${detectionMode === 'group' ? 'text-cardshow-blue' : 'text-gray-400'}`} />
                          <h4 className="font-medium">Group Mode</h4>
                          <p className="text-xs text-center text-gray-500 mt-1">Best for photos with multiple people</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Detection Sensitivity</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="text-sm h-9">Low</Button>
                        <Button variant="secondary" className="text-sm h-9">Medium</Button>
                        <Button variant="outline" className="text-sm h-9">High</Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Higher sensitivity may detect more objects but with potentially lower accuracy
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Naming Template</h3>
                      <OaklandMemorySearch 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Person {index} - {date}"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use {'{index}'} for numbering and {'{date}'} to include today's date
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <ImageEditor
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        editorImage={editorImage}
        currentFile={currentFile}
        onCropComplete={handleCropComplete}
        batchProcessingMode={detectionMode === 'group'}
        onBatchProcessComplete={handleBatchProcessing}
      />
    </div>
  );
};

export default CardDetector;
