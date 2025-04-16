import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BreadcrumbItem } from './types';
import { Team } from '@/lib/types/teamTypes'; // Correct casing

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Clear breadcrumbs on route change
    setBreadcrumbs([]);
  }, [location.pathname]);

  const value: BreadcrumbContextType = {
    breadcrumbs,
    setBreadcrumbs,
  };

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context;
};

// Helper functions to add breadcrumbs
export const useAddBreadcrumb = () => {
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumbs();

  const addBreadcrumb = (item: BreadcrumbItem) => {
    setBreadcrumbs(prev => {
      // Check if the breadcrumb already exists
      if (prev.find(b => b.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  return addBreadcrumb;
};

// Function to convert a team object to a breadcrumb item
// Fix the team property to match required fields
const teamToBreadcrumb = (team: Team): BreadcrumbItem => {
  return {
    id: `team-${team.id}`,
    label: team.name,
    path: `/teams/${team.id}`,
    parentId: 'teams'
  };
};

// Hook to add a team breadcrumb
export const useTeamBreadcrumb = (teamId: string) => {
  const addBreadcrumb = useAddBreadcrumb();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        // Simulate fetching team data
        const mockTeam: Team = {
          id: teamId,
          name: `Team ${teamId}`,
          ownerId: 'user123',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const breadcrumb = teamToBreadcrumb(mockTeam);
        addBreadcrumb(breadcrumb);
      } catch (err: any) {
        setError(err.message || 'Failed to load team');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId, addBreadcrumb]);

  return { loading, error };
};
