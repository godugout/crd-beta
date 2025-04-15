
import React from 'react';
import { Users, Calendar, Award, Camera } from 'lucide-react';
import FeatureCard from './FeatureCard';

interface OaklandFeaturesSectionProps {
  primaryColor?: string; // Add this prop to the interface
}

const OaklandFeaturesSection: React.FC<OaklandFeaturesSectionProps> = ({ 
  primaryColor = "#006341" // Default to Oakland's color
}) => {
  const features = [
    {
      title: 'Community',
      description: 'Connect with other Oakland fans in your area.',
      icon: Users
    },
    {
      title: 'Events',
      description: 'Find game day meetups and watch parties.',
      icon: Calendar
    },
    {
      title: 'Rewards',
      description: 'Earn points and redeem exclusive rewards.',
      icon: Award
    },
    {
      title: 'Memory Wall',
      description: 'Share your favorite Oakland moments with the community.',
      icon: Camera
    }
  ];
  
  // Use the primary color for styling if provided
  const iconBgClass = primaryColor ? `bg-${primaryColor}-100` : 'bg-blue-100';
  const iconTextClass = primaryColor ? `text-${primaryColor}-600` : 'text-blue-600';
  
  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Oakland Town Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            primaryColor={primaryColor}
          />
        ))}
      </div>
    </div>
  );
};

export default OaklandFeaturesSection;
