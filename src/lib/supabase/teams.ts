
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Team } from '@/lib/types/teamTypes';

export const createTeam = async (name: string, cityId: string): Promise<Team | null> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert([{ 
        id: uuidv4(), 
        city: cityId,
        league: 'MLB',
        primary_color: '#000000',
        secondary_color: '#FFFFFF'
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating team:", error);
      return null;
    }

    return {
      id: data.id,
      name: name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      city_id: data.city,
      sport: 'Baseball',
      primary_color: data.primary_color,
      secondary_color: data.secondary_color,
      team_config: { features: [], eras: [], theme: 'default' },
      is_active: true,
      created_at: data.created_at,
      updated_at: data.updated_at,
      // Additional fields
      description: data.description,
      logo_url: data.logo_url,
      league: data.league,
      division: data.division,
      founded_year: data.founded_year,
      stadium: data.stadium,
      accent_color: data.accent_color
    };
  } catch (error) {
    console.error("Error creating team:", error);
    return null;
  }
};
