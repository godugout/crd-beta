
import { teamService } from './teams';

// Create a team repository wrapper
export const teamRepository = {
  getTeams: teamService.getTeams,
  getTeamById: teamService.getTeamById,
  createTeam: teamService.createTeam,
  updateTeam: teamService.updateTeam,
  deleteTeam: teamService.deleteTeam
};

export { transformCommentFromDb } from './comments';
