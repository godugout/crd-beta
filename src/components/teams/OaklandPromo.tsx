
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface OaklandPromoProps {
  primaryColor: string;
}

const OaklandPromo: React.FC<OaklandPromoProps> = ({ primaryColor }) => {
  return (
    <div 
      className="mb-8 p-6 rounded-lg shadow-md text-white"
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
      }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">OAK.FAN - Oakland Sports Legacy Project</h2>
          <p className="text-white/90">Preserve and share your memories of Oakland sports history</p>
        </div>
        <Button 
          asChild
          className="bg-white hover:bg-gray-100" 
          style={{ color: primaryColor }}
        >
          <Link to="/oakland-landing">Learn More</Link>
        </Button>
      </div>
    </div>
  );
};

export default OaklandPromo;
