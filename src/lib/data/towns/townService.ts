
import { supabase } from '@/integrations/supabase/client';
import { Town } from '@/lib/types/town';
import { mapTownFromDb } from './mappers';

/**
 * Get a town by ID
 */
export const getTownById = async (townId: string): Promise<Town | null> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', townId)
    .single();

  if (error) {
    console.error("Error fetching town:", error);
    return null;
  }

  return data ? mapTownFromDb(data) : null;
};

/**
 * Get all towns
 */
export const getAllTowns = async (): Promise<Town[]> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*');

  if (error) {
    console.error("Error fetching towns:", error);
    return [];
  }

  return data ? data.map(mapTownFromDb) : [];
};

/**
 * Create a new town
 */
export const createTown = async (town: Omit<Town, 'id' | 'created_at' | 'updated_at'>): Promise<Town | null> => {
  const { data, error } = await supabase
    .from('teams')
    .insert({
      name: town.name,
      description: town.description,
      logo_url: town.logo_url,
      banner_url: town.banner_url,
      owner_id: town.owner_id,
      status: town.status,
      website: town.website,
      email: town.email,
      specialties: town.specialties,
      primary_color: town.primary_color,
      secondary_color: town.secondary_color,
      city: town.city,
      state: town.state
    })
    .select('*')
    .single();

  if (error) {
    console.error("Error creating town:", error);
    return null;
  }

  return data ? mapTownFromDb(data) : null;
};

/**
 * Update an existing town
 */
export const updateTown = async (townId: string, updates: Partial<Town>): Promise<Town | null> => {
  const { data, error } = await supabase
    .from('teams')
    .update({
      name: updates.name,
      description: updates.description,
      logo_url: updates.logo_url,
      banner_url: updates.banner_url,
      status: updates.status,
      website: updates.website,
      email: updates.email,
      specialties: updates.specialties,
      primary_color: updates.primary_color,
      secondary_color: updates.secondary_color,
      city: updates.city,
      state: updates.state
    })
    .eq('id', townId)
    .select('*')
    .single();

  if (error) {
    console.error("Error updating town:", error);
    return null;
  }

  return data ? mapTownFromDb(data) : null;
};

/**
 * Delete a town
 */
export const deleteTown = async (townId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', townId);

  if (error) {
    console.error("Error deleting town:", error);
    return false;
  }

  return true;
};
