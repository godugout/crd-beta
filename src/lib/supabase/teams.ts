
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Team } from '@/lib/types/teamTypes';

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
      visibility: 'public', // Set default visibility
      // Additional fields needed by the Team interface
      description: data.description,
      logoUrl: data.logo_url,
      primary_color: data.primary_color,
      secondary_color: data.secondary_color,
      tertiary_color: data.tertiary_color
    };
  } catch (error) {
    console.error("Error creating team:", error);
    return null;
  }
};
