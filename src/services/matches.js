import { apiCreateMatch, apiListMatches, apiJoinMatch, apiGetMatchById } from './api.js';

export async function createMatch(data) {
  return await apiCreateMatch(data);
}

export async function listMatches() {
  return await apiListMatches();
}

export async function joinMatch(matchId, userId) {
  return await apiJoinMatch(matchId, userId);
}

export async function getMatchById(id) {
  return await apiGetMatchById(id);
}
