
import * as teamService from './teamService';
import * as teamMembersService from './teamMembersService';
import { mapTeamFromDb, mapTeamMemberFromDb } from './mappers';

export const teamRepository = {
  // Team operations
  getTeamById: teamService.getTeamById,
  getAllTeams: teamService.getAllTeams,
  createTeam: teamService.createTeam,
  updateTeam: teamService.updateTeam,
  deleteTeam: teamService.deleteTeam,
  
  // Team member operations
  getTeamMembers: teamMembersService.getTeamMembers,
  addTeamMember: teamMembersService.addTeamMember,
  updateTeamMemberRole: teamMembersService.updateTeamMemberRole,
  removeTeamMember: teamMembersService.removeTeamMember
};

export {
  mapTeamFromDb,
  mapTeamMemberFromDb
};
