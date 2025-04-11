
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  linkText: string;
  linkTo: string;
  primaryColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  linkText, 
  linkTo, 
  primaryColor 
}) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <div 
        className="h-36 p-6 flex items-center justify-center"
        style={{ backgroundColor: `${primaryColor}10` }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-full mb-2 flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <span className="font-medium" style={{ color: primaryColor }}>{title}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-2">{linkText}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Button asChild variant="outline" className="w-full" style={{ borderColor: primaryColor, color: primaryColor }}>
          <Link to={linkTo}>{linkText}</Link>
        </Button>
      </div>
    </div>
  );
};

export default FeatureCard;
