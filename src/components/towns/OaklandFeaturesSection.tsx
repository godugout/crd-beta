
import React from 'react';
import { Users, Calendar, Award, Camera } from 'lucide-react';
import FeatureCard from './FeatureCard';

const OaklandFeaturesSection: React.FC = () => {
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
          />
        ))}
      </div>
    </div>
  );
};

export default OaklandFeaturesSection;
