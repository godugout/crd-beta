import { Team } from '@/lib/types';
import { mapTeamFromDb } from './mappers';

// In-memory store for teams
const teamsStore: Team[] = [];

export const teamService = {
  getTeams: async (): Promise<{ data: Team[] | null; error: string | null }> => {
    try {
      // Simulate fetching teams from a database
      return { data: teamsStore, error: null };
    } catch (error) {
      console.error('Error fetching teams:', error);
      return { data: null, error: 'Failed to fetch teams' };
    }
  },

  getTeamById: async (id: string): Promise<{ data: Team | null; error: string | null }> => {
    try {
      const team = teamsStore.find(team => team.id === id);
      return { data: team || null, error: null };
    } catch (error) {
      console.error('Error fetching team by ID:', error);
      return { data: null, error: 'Failed to fetch team' };
    }
  },

  createTeam: async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Team | null; error: string | null }> => {
    try {
      const newTeam: Team = {
        id: Date.now().toString(), // Simulate ID generation
        ...teamData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      teamsStore.push(newTeam);
      return { data: newTeam, error: null };
    } catch (error) {
      console.error('Error creating team:', error);
      return { data: null, error: 'Failed to create team' };
    }
  },

  updateTeam: async (id: string, updates: Partial<Team>): Promise<{ data: Team | null; error: string | null }> => {
    try {
      const teamIndex = teamsStore.findIndex(team => team.id === id);
      if (teamIndex === -1) {
        return { data: null, error: 'Team not found' };
      }

      const updatedTeam = { ...teamsStore[teamIndex], ...updates, updatedAt: new Date().toISOString() };
      teamsStore[teamIndex] = updatedTeam;
      return { data: updatedTeam, error: null };
    } catch (error) {
      console.error('Error updating team:', error);
      return { data: null, error: 'Failed to update team' };
    }
  },

  deleteTeam: async (id: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      const initialLength = teamsStore.length;
      teamsStore.filter(team => team.id !== id);
      return { success: teamsStore.length < initialLength, error: null };
    } catch (error) {
      console.error('Error deleting team:', error);
      return { success: false, error: 'Failed to delete team' };
    }
  },
};
