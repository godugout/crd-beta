
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import CardDetectorPage from '@/components/card-detector/CardDetectorPage';

const CardDetector = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p>Loading card detector...</p>
        </div>
      </div>
    }>
      <CardDetectorPage />
    </Suspense>
  );
};

export default CardDetector;
