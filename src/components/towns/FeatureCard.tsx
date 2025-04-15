
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  primaryColor?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon: Icon,
  primaryColor
}) => {
  // Generate dynamic styles based on primary color if provided
  const bgColor = primaryColor ? { backgroundColor: `${primaryColor}15` } : {}; // Add 15% opacity
  const iconColor = primaryColor ? { color: primaryColor } : {};
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={bgColor}>
        <Icon className="h-6 w-6" style={iconColor} />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
