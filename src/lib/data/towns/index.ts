
import * as townService from './townService';
import * as townMembersService from './townMembersService';
import { mapTownFromDb, mapTownMemberFromDb } from './mappers';

export const townRepository = {
  // Town operations
  getTownById: townService.getTownById,
  getAllTowns: townService.getAllTowns,
  createTown: townService.createTown,
  updateTown: townService.updateTown,
  deleteTown: townService.deleteTown,
  
  // Town member operations
  getTownMembers: townMembersService.getTownMembers,
  addTownMember: townMembersService.addTownMember,
  updateTownMemberRole: townMembersService.updateTownMemberRole,
  removeTownMember: townMembersService.removeTownMember
};

export {
  mapTownFromDb,
  mapTownMemberFromDb
};
