
import React from 'react';
import { Plus, BookOpen, BookMarked } from 'lucide-react';
import FeatureCard from './FeatureCard';

interface OaklandFeaturesSectionProps {
  primaryColor: string;
}

const OaklandFeaturesSection: React.FC<OaklandFeaturesSectionProps> = ({ primaryColor }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      <FeatureCard 
        title="Create Memory"
        description="Preserve your personal memories of Oakland sports moments."
        icon={Plus}
        linkText="Create Memory"
        linkTo="/oakland-memory-creator"
        primaryColor={primaryColor}
      />
      
      <FeatureCard 
        title="Browse Memories"
        description="Explore stories and memories from Oakland fans worldwide."
        icon={BookOpen}
        linkText="View Memories"
        linkTo="/oakland-memories"
        primaryColor={primaryColor}
      />
      
      <FeatureCard 
        title="About the Project"
        description="Learn about our mission to preserve Oakland's rich sports history."
        icon={BookMarked}
        linkText="About OAK.FAN"
        linkTo="/oakland/OaklandLanding"
        primaryColor={primaryColor}
      />
    </div>
  );
};

export default OaklandFeaturesSection;
