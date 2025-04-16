
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BreadcrumbItem } from './types';
import { Team } from '@/lib/types/teamTypes';

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  
  // Get location from react-router
  let location;
  try {
    location = useLocation();
    
    // Reset breadcrumbs when path changes
    useEffect(() => {
      setBreadcrumbs([]);
    }, [location.pathname]);
  } catch (error) {
    console.warn('BreadcrumbProvider: useLocation hook failed, router context might be missing');
    // Provide a fallback if not in a router context
  }

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

export const useAddBreadcrumb = () => {
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumbs();

  const addBreadcrumb = (item: BreadcrumbItem) => {
    setBreadcrumbs(prev => {
      if (prev.find(b => b.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  return addBreadcrumb;
};

const teamToBreadcrumb = (team: Team): BreadcrumbItem => {
  return {
    id: `team-${team.id}`,
    label: team.name,
    path: `/teams/${team.id}`,
    parentId: 'teams'
  };
};

export const useTeamBreadcrumb = (teamId: string) => {
  const addBreadcrumb = useAddBreadcrumb();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const mockTeam: Team = {
          id: teamId,
          name: `Team ${teamId}`,
          ownerId: 'user123',
          visibility: 'public',
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
