
import { Team } from '@/lib/types/BaseballTypes';

export const teams: Team[] = [
  {
    id: 'angels',
    name: 'Angels',
    fullName: 'Los Angeles Angels',
    location: 'Los Angeles',
    nickname: 'Angels',
    abbreviation: 'LAA',
    league: 'AL',
    division: 'West',
    founded: 1961,
    colorHistory: [
      { year: 1961, background: '#002F43', text: '#CF003F' },
      { year: 2002, background: '#CF003F', text: '#F0FFFF' },
    ]
  },
  {
    id: 'astros',
    name: 'Astros',
    fullName: 'Houston Astros',
    location: 'Houston',
    nickname: 'Astros',
    abbreviation: 'HOU',
    league: 'AL',
    division: 'West',
    founded: 1962,
    colorHistory: [
      { year: 1962, background: '#002850', text: '#FF401F' },
      { year: 1971, background: '#E0003F', text: '#10077E' },
      { year: 1975, background: '#FF7720', text: '#00274F' },
      { year: 1983, background: '#00274F', text: '#FF4010' },
      { year: 1994, background: '#00284F', text: '#DEA541' },
      { year: 2000, background: '#302F2F', text: '#A92C24' },
    ]
  },
  {
    id: 'athletics',
    name: 'Athletics',
    fullName: 'Oakland Athletics',
    location: 'Oakland',
    nickname: 'A\'s',
    abbreviation: 'OAK',
    league: 'AL',
    division: 'West',
    founded: 1901,
    colorHistory: [
      { year: 1901, background: '#1500B2', text: '#F0FFFF' },
      { year: 1902, background: '#002850', text: '#F0FFFF' },
      { year: 1920, background: '#00397D', text: '#F0FFFF' },
      { year: 1924, background: '#302F2D', text: '#F0FFFF' },
      { year: 1928, background: '#0836A5', text: '#F0FFFF' },
      { year: 1929, background: '#0038A0', text: '#F0FFFF' },
      { year: 1950, background: '#00377F', text: '#F0FFFF' },
      { year: 1951, background: '#002850', text: '#F0FFFF' },
      { year: 1955, background: '#002850', text: '#FB1920' },
      { year: 1963, background: '#008750', text: '#EFA72F' },
      { year: 1981, background: '#005740', text: '#FFCF30' },
      { year: 1993, background: '#00473F', text: '#FFB030' },
    ]
  },
  {
    id: 'blue-jays',
    name: 'Blue Jays',
    fullName: 'Toronto Blue Jays',
    location: 'Toronto',
    nickname: 'Blue Jays',
    abbreviation: 'TOR',
    league: 'AL',
    division: 'East',
    founded: 1977,
    colorHistory: [
      { year: 1977, background: '#00387F', text: '#FB0103' },
      { year: 2004, background: '#656A6E', text: '#0061A0' },
    ]
  },
  {
    id: 'braves',
    name: 'Braves',
    fullName: 'Atlanta Braves',
    location: 'Atlanta',
    nickname: 'Braves',
    abbreviation: 'ATL',
    league: 'NL',
    division: 'East',
    founded: 1901,
    colorHistory: [
      { year: 1901, background: '#C00030', text: '#F0FFFF' },
      { year: 1902, background: '#00274F', text: '#F0FFFF' },
      { year: 1903, background: '#C00030', text: '#00274F' },
      { year: 1904, background: '#C00030', text: '#F0FFFF' },
      { year: 1913, background: '#1F374F', text: '#C00030' },
      { year: 1924, background: '#073D7E', text: '#F0FFFF' },
      { year: 1928, background: '#00274F', text: '#F0FFFF' },
      { year: 1929, background: '#DF0030', text: '#F0FFFF' },
      { year: 1934, background: '#003760', text: '#DF0030' },
      { year: 1936, background: '#002850', text: '#FFA82F' },
      { year: 1939, background: '#DF002F', text: '#F0FFFF' },
      { year: 1940, background: '#002850', text: '#DF002F' },
      { year: 1941, background: '#002850', text: '#F0FFFF' },
      { year: 1946, background: '#003760', text: '#DF002F' },
      { year: 1972, background: '#0038A0', text: '#C0002F' },
      { year: 1982, background: '#0038A0', text: '#F0FFFF' },
      { year: 1987, background: '#003760', text: '#C00030' },
    ]
  },
  // ...continued with more teams
];

// Helper function to get a team's colors for a specific year
export function getTeamColorsForYear(teamId: string, year: number): { background: string; text: string } | null {
  const team = teams.find(t => t.id === teamId);
  if (!team) return null;
  
  // Find the most recent color scheme before or equal to the specified year
  const colorSet = [...team.colorHistory]
    .sort((a, b) => b.year - a.year)
    .find(color => color.year <= year);
    
  return colorSet || null;
}

// Helper to get a team by ID
export function getTeamById(teamId: string): Team | undefined {
  return teams.find(team => team.id === teamId);
}

// Helper to get all teams
export function getAllTeams(): Team[] {
  return teams;
}

// Get teams by league
export function getTeamsByLeague(league: 'AL' | 'NL'): Team[] {
  return teams.filter(team => team.league === league);
}

// Helper to get a team's current colors (most recent in history)
export function getCurrentTeamColors(teamId: string): { background: string; text: string } | null {
  const team = getTeamById(teamId);
  if (!team || team.colorHistory.length === 0) return null;
  
  // Return the most recent color scheme
  return team.colorHistory.reduce((latest, current) => 
    current.year > latest.year ? current : latest
  );
}
