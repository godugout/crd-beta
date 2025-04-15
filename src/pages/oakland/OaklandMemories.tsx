
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/navigation/PageLayout';
import TownBreadcrumb from '@/components/navigation/components/TownBreadcrumb';

interface TownInfo {
  name?: string;
  primary_color?: string;
  secondary_color?: string;
}

function OaklandMemories() {
  const { townId } = useParams<{ townId?: string }>();
  const [townInfo, setTownInfo] = useState<TownInfo>({});
  
  // If we have a town ID, fetch the town's details
  useEffect(() => {
    const fetchTownInfo = async () => {
      try {
        // Only fetch data we know exists in the database
        const { data, error } = await supabase
          .from('teams')
          .select('name, primary_color, secondary_color')
          .eq('id', 'oakland')
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching town info:', error);
          // Set default values if town is not found
          setTownInfo({
            name: 'Oakland',
            primary_color: '#006341',
            secondary_color: '#EFB21E'
          });
          return;
        }
          
        if (data) {
          setTownInfo({
            name: data.name,
            primary_color: data.primary_color || '#006341',
            secondary_color: data.secondary_color || '#EFB21E'
          });
          return;
        } else {
          // Set default values if town is not found
          setTownInfo({
            name: 'Oakland',
            primary_color: '#006341',
            secondary_color: '#EFB21E'
          });
        }
      } catch (err) {
        console.error('Error fetching town info:', err);
        // Set default values on error
        setTownInfo({
          name: 'Oakland',
          primary_color: '#006341',
          secondary_color: '#EFB21E'
        });
      }
    };
    
    fetchTownInfo();
  }, []);
  
  return (
    <PageLayout 
      title={townInfo.name ? `${townInfo.name} Memories` : 'Town Memories'}
      description={townInfo.name ? `Browse memories for ${townInfo.name}` : 'Browse town memories'}
    >
      <TownBreadcrumb currentPage="Memories" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{townInfo.name || 'Town'} Memories</h1>
        
        <div style={{ 
          backgroundColor: townInfo.primary_color || '#ccc',
          color: '#fff',
          padding: '2rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <p className="text-lg">
            Browse and explore memories from {townInfo.name || 'this town'}'s rich history.
          </p>
        </div>
        
        {/* Memory content will go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">First Memory</h3>
            <p className="text-gray-600">This is where memories will be displayed.</p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Second Memory</h3>
            <p className="text-gray-600">Each memory card will show details and images.</p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Third Memory</h3>
            <p className="text-gray-600">Clicking on a memory will take you to its details.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default OaklandMemories;
