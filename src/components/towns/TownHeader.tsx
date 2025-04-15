
import React from 'react';
import { Building } from 'lucide-react';

interface TownHeaderProps {
  name: string;
  description: string;
  logo?: string;
  primaryColor?: string;
}

const TownHeader: React.FC<TownHeaderProps> = ({ name, description, logo, primaryColor }) => {
  return (
    <div className="flex items-center mb-8">
      {logo ? (
        <img src={logo} alt={name} className="h-16 w-16 mr-4" />
      ) : (
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mr-4">
          <Building className="h-8 w-8 text-gray-500" />
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>{name}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default TownHeader;
