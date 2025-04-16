
import React from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';

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
            <DollarSign className="mr-2 h-5 w-5" />
            Live Card Breaking & Auctions
          </h2>
          <p className="text-blue-100">
            Join live breaking sessions and bid on physical & digital collectibles in real-time
          </p>
        </div>
        <Button 
          className="bg-white text-blue-700 hover:bg-blue-50"
          onClick={() => window.location.href = '/cards/auction'}
        >
          Join Live Auction
        </Button>
      </div>
    </div>
  );
};

export default BaseballBanner;
