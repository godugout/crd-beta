
import { supabase } from '@/integrations/supabase/client';
import { 
  OaklandMemory, 
  AudioMemory, 
  OaklandMascot, 
  JumbotronContent,
  FeaturedOaklandContent 
} from '@/lib/types/oaklandTypes';

// TEMPORARY: Since new tables aren't in Supabase types yet, we'll use existing Oakland tables
// and provide fallback implementations until the SQL migration is applied

// Audio Memories Repository (using existing oakland_memories table temporarily)
export const audioMemoryOperations = {
  async getAll(): Promise<AudioMemory[]> {
    // Return sample data for now until SQL migration is applied
    return [
      {
        id: '1',
        user_id: 'demo',
        title: 'Walk-off Victory vs Angels',
        description: 'The crowd goes wild after that amazing walk-off!',
        audio_url: '/audio/walkoff-crowd.mp3',
        duration: 180,
        memory_type: 'game_reaction',
        tags: ['walkoff', 'victory', 'angels'],
        cassette_label: 'RALLY TAPE #1',
        plays_count: 45,
        era: 'playoff_runs',
        game_date: '2002-10-05',
        opponent: 'Anaheim Angels',
        is_featured: true,
        visibility: 'public',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        user_id: 'demo',
        title: 'Last Game at Coliseum',
        description: 'Emotional farewell to our beloved ballpark',
        audio_url: '/audio/farewell-coliseum.mp3',
        duration: 240,
        memory_type: 'story',
        tags: ['farewell', 'coliseum', 'emotional'],
        cassette_label: 'GOODBYE OAKLAND',
        plays_count: 89,
        era: 'farewell',
        game_date: '2024-09-26',
        opponent: 'Texas Rangers',
        is_featured: true,
        visibility: 'public',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  },

  async getByUser(userId: string): Promise<AudioMemory[]> {
    // Fallback implementation
    const all = await this.getAll();
    return all.filter(audio => audio.user_id === userId);
  },

  async getByEra(era: string): Promise<AudioMemory[]> {
    // Fallback implementation
    const all = await this.getAll();
    return all.filter(audio => audio.era === era);
  },

  async getFeatured(): Promise<AudioMemory[]> {
    // Fallback implementation
    const all = await this.getAll();
    return all.filter(audio => audio.is_featured);
  },

  async create(audioMemory: Omit<AudioMemory, 'id' | 'created_at' | 'updated_at'>): Promise<AudioMemory> {
    // Fallback implementation - would normally insert to database
    const newAudio: AudioMemory = {
      ...audioMemory,
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    console.log('Would create audio memory:', newAudio);
    return newAudio;
  },

  async incrementPlays(id: string): Promise<void> {
    // Fallback implementation
    console.log('Would increment plays for:', id);
  }
};

// Mascots Repository (using sample data until SQL migration)
export const mascotOperations = {
  async getAll(): Promise<OaklandMascot[]> {
    return [
      {
        id: '1',
        name: 'Rally Possum',
        description: 'The scrappy survivor who represents Oakland\'s grassroots spirit',
        image_url: '/images/rally-possum.png',
        personality_traits: ['resilient', 'community-minded', 'scrappy', 'loyal'],
        catchphrases: ['Oakland Strong!', 'We\'re still here!', 'Rally time!'],
        backstory: 'Born from the viral 2013 playoff run, Rally Possum embodies the never-give-up spirit of Oakland fans.',
        protest_message: 'You can move the team, but you can\'t move the heart of Oakland baseball!',
        era: 'playoff_runs',
        is_featured: true,
        fan_favorites: 1247,
        adoption_count: 892,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Protest Pete',
        description: 'The activist mascot who holds truth to power',
        image_url: '/images/protest-pete.png',
        personality_traits: ['rebellious', 'passionate', 'justice-oriented', 'vocal'],
        catchphrases: ['Sell the Team!', 'Vegas Ain\'t Home!', 'Oakland Forever!'],
        backstory: 'Emerged during the relocation battles, Pete represents fan resistance to corporate greed.',
        protest_message: 'Baseball belongs to the fans, not billionaire owners!',
        era: 'farewell',
        is_featured: true,
        fan_favorites: 2156,
        adoption_count: 1543,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  },

  async getFeatured(): Promise<OaklandMascot[]> {
    const all = await this.getAll();
    return all.filter(mascot => mascot.is_featured);
  },

  async getByEra(era: string): Promise<OaklandMascot[]> {
    const all = await this.getAll();
    return all.filter(mascot => mascot.era === era);
  },

  async adoptMascot(id: string): Promise<void> {
    console.log('Would adopt mascot:', id);
  },

  async favoriteMascot(id: string): Promise<void> {
    console.log('Would favorite mascot:', id);
  }
};

// Jumbotron Repository (using sample data until SQL migration)
export const jumbotronOperations = {
  async getActive(): Promise<JumbotronContent[]> {
    return [
      {
        id: '1',
        user_id: 'system',
        message: 'WELCOME TO OAK.FAN - WHERE OAKLAND MEMORIES LIVE FOREVER',
        display_type: 'scroll',
        color_scheme: 'green',
        priority: 10,
        is_active: true,
        moderation_status: 'approved',
        vote_count: 0,
        category: 'announcement',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        user_id: 'fan-1',
        message: 'SELL THE TEAM! SELL THE TEAM!',
        display_type: 'flash',
        color_scheme: 'protest_red',
        priority: 8,
        is_active: true,
        moderation_status: 'approved',
        vote_count: 156,
        category: 'protest',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  },

  async getByCategory(category: string): Promise<JumbotronContent[]> {
    const all = await this.getActive();
    return all.filter(content => content.category === category);
  },

  async create(content: Omit<JumbotronContent, 'id' | 'created_at' | 'updated_at'>): Promise<JumbotronContent> {
    const newContent: JumbotronContent = {
      ...content,
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    console.log('Would create jumbotron content:', newContent);
    return newContent;
  },

  async vote(id: string): Promise<void> {
    console.log('Would vote for jumbotron message:', id);
  }
};

// Featured Content Repository (using sample data until SQL migration)
export const featuredContentOperations = {
  async getFeaturedContent(): Promise<FeaturedOaklandContent[]> {
    const audioMemories = await audioMemoryOperations.getFeatured();
    const mascots = await mascotOperations.getFeatured();
    
    const featured: FeaturedOaklandContent[] = [
      ...audioMemories.map(audio => ({
        content_type: 'audio' as const,
        id: audio.id,
        title: audio.title,
        description: audio.description,
        era: audio.era,
        created_at: audio.created_at,
        media_url: audio.audio_url,
        user_id: audio.user_id
      })),
      ...mascots.map(mascot => ({
        content_type: 'mascot' as const,
        id: mascot.id,
        title: mascot.name,
        description: mascot.description,
        era: mascot.era,
        created_at: mascot.created_at,
        media_url: mascot.image_url
      }))
    ];

    return featured.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async refreshFeaturedContent(): Promise<void> {
    console.log('Would refresh featured content materialized view');
  }
};

// Enhanced Oakland Memories Operations (using existing oakland_memories table)
export const enhancedOaklandMemoryOperations = {
  async getWithAudioAndMascot(id: string): Promise<OaklandMemory & { audio_memory?: AudioMemory; mascot?: OaklandMascot }> {
    try {
      const { data, error } = await supabase
        .from('oakland_memories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // For now, return without joined data until SQL migration is complete
      return data as OaklandMemory;
    } catch (error) {
      console.error('Error fetching memory with relationships:', error);
      throw error;
    }
  },

  async getByPlayerMentioned(player: string): Promise<OaklandMemory[]> {
    try {
      const { data, error } = await supabase
        .from('oakland_memories')
        .select('*')
        .ilike('attendees', `%${player}%`) // Using attendees field temporarily
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as OaklandMemory[] || [];
    } catch (error) {
      console.error('Error fetching memories by player:', error);
      return [];
    }
  },

  async getBySeasonYear(year: number): Promise<OaklandMemory[]> {
    try {
      const { data, error } = await supabase
        .from('oakland_memories')
        .select('*')
        .gte('game_date', `${year}-01-01`)
        .lt('game_date', `${year + 1}-01-01`)
        .eq('visibility', 'public')
        .order('game_date', { ascending: false });
      
      if (error) throw error;
      return data as OaklandMemory[] || [];
    } catch (error) {
      console.error('Error fetching memories by season year:', error);
      return [];
    }
  }
};
