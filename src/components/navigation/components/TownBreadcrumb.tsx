
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Home, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TownBreadcrumbProps {
  currentPage?: string;
}

interface TownInfo {
  name: string;
  color?: string;
}

const TownBreadcrumb: React.FC<TownBreadcrumbProps> = ({ currentPage }) => {
  let townId;
  
  try {
    // Wrap in try/catch to handle usage outside Router context
    const params = useParams<{ townId?: string }>();
    townId = params.townId;
  } catch (error) {
    console.warn('TownBreadcrumb: useParams hook failed, router context might be missing');
    return null;
  }
  
  const [townInfo, setTownInfo] = useState<TownInfo>({ name: '' });
  
  useEffect(() => {
    const fetchTownInfo = async () => {
      if (!townId) return;
      
      try {
        // Get town information from the database
        const { data, error } = await supabase
          .from('teams')
          .select('name, primary_color')
          .eq('id', townId)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching town for breadcrumb:', error);
          // Use fallback when there's an error
          setTownInfo({
            name: townId.charAt(0).toUpperCase() + townId.slice(1),
            color: undefined
          });
          return;
        }
          
        if (data) {
          // If we have valid data, use it
          setTownInfo({
            name: data.name || townId,
            color: data.primary_color
          });
        } else {
          // Fallback to using the slug if no data found
          setTownInfo({
            name: townId.charAt(0).toUpperCase() + townId.slice(1),
            color: undefined
          });
        }
      } catch (err) {
        console.error('Error in town breadcrumb:', err);
        setTownInfo({
          name: townId.charAt(0).toUpperCase() + townId.slice(1),
          color: undefined
        });
      }
    };
    
    fetchTownInfo();
  }, [townId]);
  
  if (!townId) return null;
  
  return (
    <nav className="flex items-center text-sm py-3 px-4 bg-gray-50">
      <Link to="/" className="text-gray-500 hover:text-gray-700">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
      
      <Link to="/towns" className="text-gray-500 hover:text-gray-700 flex items-center">
        <Building className="w-4 h-4 mr-1" />
        <span>Towns</span>
      </Link>
      
      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
      
      <Link 
        to={`/towns/${townId}`} 
        className="hover:underline flex items-center"
        style={{ color: townInfo.color || '#333' }}
      >
        <span className="font-medium">{townInfo.name || townId}</span>
      </Link>
      
      {currentPage && (
        <>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-700">{currentPage}</span>
        </>
      )}
    </nav>
  );
};

export default TownBreadcrumb;
