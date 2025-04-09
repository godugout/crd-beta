
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardUpload from '@/components/card-upload/CardUpload';

const CardDetector = () => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  
  const handleImageUpload = (file: File, previewUrl: string, storagePath?: string) => {
    console.log('Image uploaded:', file.name, storagePath);
    setProcessedImageUrl(previewUrl);
  };
  
  return (
    <PageLayout
      title="Card Detector"
      description="Detect and digitize physical cards"
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Card Detector</h1>
          <p className="text-gray-600 mt-2">
            Upload images of physical cards to detect and digitize them
          </p>
        </div>
        
        <CardUpload 
          onImageUpload={handleImageUpload}
          batchProcessingEnabled 
          enabledMemorabiliaTypes={['card', 'ticket', 'program']}
        />
        
        {processedImageUrl && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Processed Image</h2>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <img src={processedImageUrl} alt="Processed card" className="w-full h-auto" />
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CardDetector;
