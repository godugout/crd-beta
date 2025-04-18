
import { useState, useEffect } from 'react';
import { TownDisplayData } from '@/lib/types/town';

interface FilterOptions {
  region?: string;
  searchQuery?: string;
  featured?: boolean;
  nearby?: boolean;
  // Add other filter options as needed
}

interface SortOptions {
  field?: string;
  direction?: 'asc' | 'desc';
}

const useTownGalleryData = (filterOptions: FilterOptions = {}, sortOptions: SortOptions = {}) => {
  const [towns, setTowns] = useState<TownDisplayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchTowns = async () => {
      if (!isMounted) return;
      
      // Don't repeatedly toggle loading state for subsequent fetches
      if (isInitialLoad) {
        setLoading(true);
      }
      
      try {
        // Simulate API call with mock data for now
        // Add a consistent delay to prevent flash of loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockTowns: TownDisplayData[] = [
          {
            id: '1',
            name: 'Oakland',
            slug: 'oakland',
            description: 'City in California with rich baseball history',
            logo_url: '/lovable-uploads/371b81a2-cafa-4637-9358-218d4120c658.png',
            memberCount: 433,
            owner_id: 'user-123',
            primary_color: '#00A550',
            secondary_color: '#FFCD00',
            founded_year: 1852,
            city: 'Oakland',
            state: 'California'
          },
          {
            id: '2',
            name: 'San Francisco',
            slug: 'san-francisco',
            description: 'City by the bay with iconic landmarks',
            logo_url: '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
            memberCount: 873,
            owner_id: 'user-456',
            primary_color: '#FF4C00',
            secondary_color: '#000000',
            founded_year: 1776,
            city: 'San Francisco',
            state: 'California'
          }
        ];
        
        // Apply filters if any
        let filteredTowns = [...mockTowns];
        
        if (filterOptions.region) {
          filteredTowns = filteredTowns.filter(town => 
            town.state?.toLowerCase() === filterOptions.region?.toLowerCase()
          );
        }
        
        if (filterOptions.featured === true) {
          // Filter logic for featured towns would go here
          // For now, just return all towns since we don't have a featured flag
        }
        
        if (filterOptions.nearby === true) {
          // Filter towns within a certain distance, e.g., 50 miles
          // For mock data, just return all towns
        }
        
        if (filterOptions.searchQuery) {
          const query = filterOptions.searchQuery.toLowerCase();
          filteredTowns = filteredTowns.filter(town => 
            town.name.toLowerCase().includes(query) || 
            town.description?.toLowerCase().includes(query)
          );
        }
        
        // Apply sorting if specified
        if (sortOptions.field) {
          filteredTowns.sort((a: any, b: any) => {
            const fieldA = a[sortOptions.field as keyof TownDisplayData];
            const fieldB = b[sortOptions.field as keyof TownDisplayData];
            
            if (!fieldA || !fieldB) return 0;
            
            const comparison = fieldA > fieldB ? 1 : -1;
            return sortOptions.direction === 'desc' ? -comparison : comparison;
          });
        }
        
        if (isMounted) {
          setTowns(filteredTowns);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching towns:', err);
        if (isMounted) {
          setError('Failed to load towns. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    fetchTowns();
    
    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [filterOptions, sortOptions, isInitialLoad]);

  return { towns, loading, error, isInitialLoad };
};

export default useTownGalleryData;
