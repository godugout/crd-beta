
import { supabase } from '@/integrations/supabase/client';
import { TeamMember, User, UserRole } from '@/lib/types';
import { Team } from '@/lib/types/TeamTypes';

const mapTeamFromDb = (team: any): Team => ({
  id: team.id,
  name: team.name,
  description: team.description,
  logo_url: team.logo_url,
  bannerUrl: team.banner_url,
  owner_id: team.owner_id,
  status: team.status,
  website: team.website,
  email: team.email,
  specialties: team.specialties,
  created_at: team.created_at,
  updated_at: team.updated_at
});

const getTeamById = async (teamId: string): Promise<Team | null> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', teamId)
    .single();

  if (error) {
    console.error("Error fetching team:", error);
    return null;
  }

  return data ? mapTeamFromDb(data) : null;
};

const getAllTeams = async (): Promise<Team[]> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*');

  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }

  return data ? data.map(mapTeamFromDb) : [];
};

const createTeam = async (team: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Promise<Team | null> => {
  const { data, error } = await supabase
    .from('teams')
    .insert({
      name: team.name,
      description: team.description,
      logo_url: team.logo_url,
      banner_url: team.bannerUrl,
      owner_id: team.owner_id,
      status: team.status,
      website: team.website,
      email: team.email,
      specialties: team.specialties
    })
    .select('*')
    .single();

  if (error) {
    console.error("Error creating team:", error);
    return null;
  }

  return data ? mapTeamFromDb(data) : null;
};

const updateTeam = async (teamId: string, updates: Partial<Team>): Promise<Team | null> => {
  const { data, error } = await supabase
    .from('teams')
    .update({
      name: updates.name,
      description: updates.description,
      logo_url: updates.logo_url,
      banner_url: updates.bannerUrl,
      status: updates.status,
      website: updates.website,
      email: updates.email,
      specialties: updates.specialties
    })
    .eq('id', teamId)
    .select('*')
    .single();

  if (error) {
    console.error("Error updating team:", error);
    return null;
  }

  return data ? mapTeamFromDb(data) : null;
};

const deleteTeam = async (teamId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', teamId);

  if (error) {
    console.error("Error deleting team:", error);
    return false;
  }

  return true;
};

const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*, users(*)')
    .eq('team_id', teamId);

  if (error) {
    console.error("Error fetching team members:", error);
    return [];
  }

  return data ? data.map(mapTeamMemberFromDb) : [];
};

const mapTeamMemberFromDb = (member: any): TeamMember => {
  const user: User = {
    id: member.user_id,
    email: member.users?.email,
    displayName: member.users?.display_name,
    name: member.users?.full_name,
    avatarUrl: member.users?.avatar_url,
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    id: member.id,
    teamId: member.team_id,
    userId: member.user_id,
    role: member.role,
    joinedAt: member.joined_at,
    user
  };
};

const addTeamMember = async (teamId: string, userId: string, role: string): Promise<TeamMember | null> => {
  const { data, error } = await supabase
    .from('team_members')
    .insert({
      team_id: teamId,
      user_id: userId,
      role: role
    })
    .select('*, users(*)')
    .single();

  if (error) {
    console.error("Error adding team member:", error);
    return null;
  }

  return data ? mapTeamMemberFromDb(data) : null;
};

const updateTeamMemberRole = async (teamMemberId: string, role: string): Promise<TeamMember | null> => {
  const { data, error } = await supabase
    .from('team_members')
    .update({ role: role })
    .eq('id', teamMemberId)
    .select('*, users(*)')
    .single();

  if (error) {
    console.error("Error updating team member role:", error);
    return null;
  }

  return data ? mapTeamMemberFromDb(data) : null;
};

const removeTeamMember = async (teamMemberId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', teamMemberId);

  if (error) {
    console.error("Error removing team member:", error);
    return false;
  }

  return true;
};

export const teamRepository = {
  getTeamById,
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  addTeamMember,
  updateTeamMemberRole,
  removeTeamMember
};
