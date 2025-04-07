
// Update the part where the error occurs - the transformTeamMember function
import { TeamMember, User } from '@/lib/types';

function transformTeamMember(dbTeamMember: any): TeamMember {
  // Basic team member properties
  const teamMember: TeamMember = {
    id: dbTeamMember.id,
    teamId: dbTeamMember.team_id,
    userId: dbTeamMember.user_id,
    role: dbTeamMember.role as "owner" | "admin" | "member" | "viewer",
    joinedAt: dbTeamMember.joined_at,
  };
  
  // If user data is available, add it
  if (dbTeamMember.profiles) {
    const userData = dbTeamMember.profiles;
    if (userData) {
      teamMember.user = {
        id: userData.id,
        email: userData.email || '',
        name: userData.full_name,
        avatarUrl: userData.avatar_url,
        username: userData.username
      };
    }
  }
  
  return teamMember;
}
