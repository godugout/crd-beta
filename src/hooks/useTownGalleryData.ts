
import { useState, useEffect } from 'react';

interface Town {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  population?: number;
  region?: string;
  isFeatured?: boolean;
  distance?: number; // For nearby towns
  // Add any other town properties you need
}

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
  const [towns, setTowns] = useState<Town[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTowns = async () => {
      setLoading(true);
      try {
        // Simulate API call with mock data for now
        // In a real app, you'd make an actual API call here
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockTowns: Town[] = [
          {
            id: '1',
            name: 'Oakland',
            description: 'City in California with rich baseball history',
            imageUrl: '/lovable-uploads/371b81a2-cafa-4637-9358-218d4120c658.png',
            population: 433031,
            region: 'West Coast',
            isFeatured: true,
            distance: 0
          },
          {
            id: '2',
            name: 'San Francisco',
            description: 'City by the bay with iconic landmarks',
            imageUrl: '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
            population: 873965,
            region: 'West Coast',
            isFeatured: true,
            distance: 12
          }
        ];
        
        // Apply filters if any
        let filteredTowns = [...mockTowns];
        
        if (filterOptions.region) {
          filteredTowns = filteredTowns.filter(town => 
            town.region?.toLowerCase() === filterOptions.region?.toLowerCase()
          );
        }
        
        if (filterOptions.featured === true) {
          filteredTowns = filteredTowns.filter(town => town.isFeatured === true);
        }
        
        if (filterOptions.nearby === true) {
          // Filter towns within a certain distance, e.g., 50 miles
          filteredTowns = filteredTowns.filter(town => 
            typeof town.distance === 'number' && town.distance <= 50
          );
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
            const fieldA = a[sortOptions.field as keyof Town];
            const fieldB = b[sortOptions.field as keyof Town];
            
            if (!fieldA || !fieldB) return 0;
            
            const comparison = fieldA > fieldB ? 1 : -1;
            return sortOptions.direction === 'desc' ? -comparison : comparison;
          });
        }
        
        setTowns(filteredTowns);
        setError(null);
      } catch (err) {
        console.error('Error fetching towns:', err);
        setError('Failed to load towns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTowns();
  }, [filterOptions, sortOptions]);

  return { towns, loading, error };
};

export default useTownGalleryData;
