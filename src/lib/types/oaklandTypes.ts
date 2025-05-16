
/**
 * Interface for Oakland memory data
 */
export interface OaklandMemoryData {
  title: string;
  description: string;
  date?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  memoryType?: string;
  attendees?: string[];
  tags?: string[];
  imageUrl?: string;
  historicalContext?: string;
  personalSignificance?: string;
  cardId?: string;
}

/**
 * Interface for team data
 */
export interface OaklandTeam {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  era: string;
  yearFounded: string;
  yearDissolved?: string;
  homeStadium?: string;
  championships?: string[];
  notableEvents?: OaklandEvent[];
}

/**
 * Interface for Oakland events
 */
export interface OaklandEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  location?: string;
  participants?: string[];
  significance: string;
  tags?: string[];
}

/**
 * Interface for team rosters
 */
export interface OaklandRoster {
  teamId: string;
  season: string;
  coach?: string;
  players: OaklandPlayer[];
  record?: string;
  standing?: string;
}

/**
 * Interface for player data
 */
export interface OaklandPlayer {
  id: string;
  name: string;
  position: string;
  jerseyNumber?: string;
  imageUrl?: string;
  seasons: string[];
  stats?: Record<string, any>;
  notableAchievements?: string[];
  bio?: string;
}
