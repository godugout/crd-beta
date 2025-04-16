import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Team } from '@/lib/types/teamTypes'; // Use consistent casing

export const createTeam = async (name: string, ownerId: string): Promise<Team | null> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert([{ id: uuidv4(), name, owner_id: ownerId }])
      .select()
      .single();

    if (error) {
      console.error("Error creating team:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      ownerId: data.owner_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error("Error creating team:", error);
    return null;
  }
};
