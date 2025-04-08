
import React from 'react';
import PageLayout from '@/components/navigation/PageLayout';
import CardUpload from '@/components/card-upload/CardUpload';

const CardDetector = () => {
  return (
    <PageLayout
      title="Card Detector"
      description="Detect and digitize physical cards"
    >
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Card Detector</h1>
          <p className="text-gray-600 mt-2">
            Upload images of physical cards to detect and digitize them
          </p>
        </div>
        
        <CardUpload />
      </div>
    </PageLayout>
  );
};

export default CardDetector;
