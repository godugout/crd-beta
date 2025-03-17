
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { CropIcon, ChevronRight, Upload, SaveAll } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImageEditor } from '@/components/card-upload';
import { useCards } from '@/context/CardContext';

const CardDetector = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [editorImage, setEditorImage] = useState<string | null>(null);
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
      description: 'Detected and cropped with Card Detector',
      imageUrl: croppedUrl,
      thumbnailUrl: croppedUrl,
      tags: ['card detector', 'auto-detected'],
      userId: 'dev-user-id',
      isPublic: false
    };

    addCard(newCard);
    
    toast.success('Card added to your gallery!', {
      description: 'Your detected card has been successfully added'
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
              Upload an image containing trading cards to automatically detect, crop, and add them to your gallery
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              {!showEditor ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-blue-50 p-6 rounded-full mb-6">
                    <Upload className="h-12 w-12 text-cardshow-blue" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Upload an image with cards</h2>
                  <p className="text-cardshow-slate text-center max-w-md mb-6">
                    Upload an image containing trading cards, and we'll automatically detect and extract them for you.
                    Supports images with multiple cards.
                  </p>
                  <Button
                    size="lg"
                    className="relative"
                    onClick={() => document.getElementById('card-upload')?.click()}
                  >
                    Select Image
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
                    <h2 className="text-xl font-semibold">Detected Cards</h2>
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
                    <p>Use the editor to adjust the selection boxes around each detected card.</p>
                  </div>
                </div>
              )}
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
      />
    </div>
  );
};

export default CardDetector;
