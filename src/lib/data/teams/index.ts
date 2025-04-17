
import { teamService } from './teamService';
import { teamMembersService } from './teamMembersService';
import { mapTeamFromDb, mapTeamMemberFromDb } from './mappers';

export {
  teamService,
  teamMembersService,
  mapTeamFromDb,
  mapTeamMemberFromDb
};

// Create a team repository wrapper
export const teamRepository = {
  getTeams: teamService.getTeams,
  getTeamById: teamService.getTeamById,
  createTeam: teamService.createTeam,
  updateTeam: teamService.updateTeam,
  deleteTeam: teamService.deleteTeam
};
