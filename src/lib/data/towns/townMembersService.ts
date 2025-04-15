
import { supabase } from '@/integrations/supabase/client';
import { TownMember } from '@/lib/types/town';
import { mapTownMemberFromDb } from './mappers';

/**
 * Get all members of a town
 */
export const getTownMembers = async (townId: string): Promise<TownMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*, users:user_id(*)')
    .eq('team_id', townId);

  if (error) {
    console.error("Error fetching town members:", error);
    return [];
  }

  return data ? data.map(mapTownMemberFromDb) : [];
};

/**
 * Add a new member to a town
 */
export const addTownMember = async (townId: string, userId: string, role: string): Promise<TownMember | null> => {
  const { data, error } = await supabase
    .from('team_members')
    .insert({
      team_id: townId,
      user_id: userId,
      role: role
    })
    .select('*, users:user_id(*)')
    .single();

  if (error) {
    console.error("Error adding town member:", error);
    return null;
  }

  return data ? mapTownMemberFromDb(data) : null;
};

/**
 * Update a town member's role
 */
export const updateTownMemberRole = async (townMemberId: string, role: string): Promise<TownMember | null> => {
  const { data, error } = await supabase
    .from('team_members')
    .update({ role: role })
    .eq('id', townMemberId)
    .select('*, users:user_id(*)')
    .single();

  if (error) {
    console.error("Error updating town member role:", error);
    return null;
  }

  return data ? mapTownMemberFromDb(data) : null;
};

/**
 * Remove a member from a town
 */
export const removeTownMember = async (townMemberId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', townMemberId);

  if (error) {
    console.error("Error removing town member:", error);
    return false;
  }

  return true;
};
