
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface OaklandPromoProps {
  primaryColor?: string;
}

const OaklandPromo: React.FC<OaklandPromoProps> = ({ primaryColor }) => {
  const buttonStyle = primaryColor ? { 
    backgroundColor: primaryColor,
    color: '#ffffff',
    border: 'none'
  } : {};

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg mb-10 border border-gray-200">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold mb-3">
          Oakland Sports Memory Project
        </h2>
        <p className="text-gray-700 mb-6">
          Preserving the rich history of Oakland sports through fan memories, stories and memorabilia.
          Join our community project to commemorate the legacy of Oakland teams and fans.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild style={buttonStyle}>
            <Link to="/towns/oakland/memories">Browse Memories</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/towns/oakland/contribute">Contribute</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OaklandPromo;
