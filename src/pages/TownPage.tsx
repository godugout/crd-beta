
import React from 'react';
import { useParams } from 'react-router-dom';
import TownNotFound from '@/components/towns/TownNotFound';
import OaklandTownPage from '@/components/towns/OaklandTownPage';
import StandardTownPage from '@/components/towns/StandardTownPage';

interface TownPageProps {
  townId?: string;
}

const TownPage: React.FC<TownPageProps> = ({ townId: propTownId }) => {
  const { townId: paramTownId } = useParams<{ townId?: string }>();
  
  // Use townId from props if provided, otherwise from URL params
  const townId = propTownId || paramTownId;
  
  const towns = [
    {
      id: 'oakland',
      name: 'Oakland',
      logo: '/logo-oak.png',
      primaryColor: '#006341',
      secondaryColor: '#EFB21E',
      description: 'Oakland town page'
    },
    {
      id: 'sf-giants',
      name: 'San Francisco',
      logo: '/logo-sfg.png',
      primaryColor: '#FD5A1E',
      secondaryColor: '#27251F',
      description: 'San Francisco town page'
    }
  ];

  // If we have a town ID, find the matching town
  if (townId) {
    const town = towns.find(t => t.id === townId);
    
    // Town not found
    if (!town) {
      return <TownNotFound />;
    }
    
    // Oakland town page (with special features)
    if (townId === 'oakland') {
      return <OaklandTownPage town={town} />;
    }
    
    // Regular town page for other towns
    return <StandardTownPage town={town} />;
  }
  
  // Fallback to TownNotFound if no townId is provided
  return <TownNotFound />;
};

export default TownPage;
