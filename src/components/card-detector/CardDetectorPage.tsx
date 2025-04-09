
import React, { useState } from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardUpload from '@/components/card-upload/CardUpload';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';

const CardDetector = () => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processedMetadata, setProcessedMetadata] = useState<any>(null);
  
  const handleImageUpload = (file: File, previewUrl: string, memType?: MemorabiliaType, metadata?: any) => {
    console.log('Image uploaded:', file.name);
    setProcessedImageUrl(previewUrl);
    setProcessedMetadata(metadata);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Processed Card</h2>
              <div className="border rounded-lg overflow-hidden shadow-md">
                <img src={processedImageUrl} alt="Processed card" className="w-full h-auto" />
              </div>
            </div>
            
            {processedMetadata && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Detected Metadata</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  {processedMetadata.title && (
                    <div className="mb-2">
                      <span className="font-medium">Title:</span> {processedMetadata.title}
                    </div>
                  )}
                  
                  {processedMetadata.player && (
                    <div className="mb-2">
                      <span className="font-medium">Player:</span> {processedMetadata.player}
                    </div>
                  )}
                  
                  {processedMetadata.team && (
                    <div className="mb-2">
                      <span className="font-medium">Team:</span> {processedMetadata.team}
                    </div>
                  )}
                  
                  {processedMetadata.year && (
                    <div className="mb-2">
                      <span className="font-medium">Year:</span> {processedMetadata.year}
                    </div>
                  )}
                  
                  {processedMetadata.tags && processedMetadata.tags.length > 0 && (
                    <div className="mb-2">
                      <span className="font-medium">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {processedMetadata.tags.map((tag: string, index: number) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {processedMetadata.text && (
                    <div className="mt-4">
                      <span className="font-medium">Detected Text:</span>
                      <p className="text-sm mt-1 text-gray-700">{processedMetadata.text}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CardDetector;
