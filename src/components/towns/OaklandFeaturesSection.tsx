
import React from 'react';
import { Camera, Book, Ticket, Users } from 'lucide-react';
import FeatureCard from './FeatureCard';

interface OaklandFeaturesSectionProps {
  primaryColor: string;
}

const OaklandFeaturesSection: React.FC<OaklandFeaturesSectionProps> = ({ primaryColor }) => {
  const features = [
    {
      title: 'Memory Gallery',
      description: 'Browse fan-submitted memories and stories from Oakland sports history',
      icon: Camera,
      linkText: 'Browse Memories',
      linkTo: '/towns/oakland/memories'
    },
    {
      title: 'Timeline',
      description: 'Explore key moments in Oakland sports history through an interactive timeline',
      icon: Book,
      linkText: 'Explore Timeline',
      linkTo: '/towns/oakland/timeline'
    },
    {
      title: 'Events',
      description: 'Find upcoming events related to Oakland sports heritage and community',
      icon: Ticket,
      linkText: 'View Events',
      linkTo: '/towns/oakland/events'
    },
    {
      title: 'Groups',
      description: 'Connect with other Oakland sports fans through community groups',
      icon: Users,
      linkText: 'Join Groups',
      linkTo: '/towns/oakland/groups'
    }
  ];

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-6">Oakland Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index} 
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            linkText={feature.linkText}
            linkTo={feature.linkTo}
            primaryColor={primaryColor}
          />
        ))}
      </div>
    </div>
  );
};

export default OaklandFeaturesSection;
