
export interface TeamColor {
  year: number;
  background: string;
  text: string;
}

export interface Team {
  id: string;
  name: string;
  fullName?: string;
  location?: string;
  nickname?: string;
  abbreviation?: string;
  colorHistory: TeamColor[];
  currentColors?: TeamColor;
  league?: 'AL' | 'NL';
  division?: 'East' | 'Central' | 'West';
  founded?: number;
  logo?: string;
}

export interface League {
  id: string;
  name: string;
  abbreviation: string;
  teams: Team[];
}

// Additional types for future expansion
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  number?: number;
  position?: string;
  teamId?: string;
  stats?: Record<string, any>;
}

export interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  homeScore?: number;
  awayScore?: number;
  venue?: string;
  completed?: boolean;
}

export interface Season {
  year: number;
  startDate: string;
  endDate: string;
  games?: Game[];
}
