
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tv2 } from 'lucide-react';

interface BaseballBannerProps {
  isVisible: boolean;
}

export const BaseballBanner: React.FC<BaseballBannerProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg overflow-hidden shadow-lg">
      <div className="p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-white text-xl font-bold mb-2 flex items-center">
            <Tv2 className="mr-2 h-5 w-5" />
            ESPN-Style Baseball Card Viewer
          </h2>
          <p className="text-blue-100">
            Experience your vintage baseball cards in 3D with our immersive viewer featuring statistics and professional graphics
          </p>
        </div>
        <Button 
          className="bg-white text-blue-700 hover:bg-blue-50"
          onClick={() => window.location.href = '/baseball-card-viewer'}
        >
          Launch Immersive Viewer
        </Button>
      </div>
    </div>
  );
};

export default BaseballBanner;
