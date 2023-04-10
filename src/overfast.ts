import axios from "axios";

import { PlayerIdSchema } from "./schemas/player-id.js";
import { PlayerNamesSchema } from "./schemas/player-names.js";
import { PlayerSummarySchema } from "./schemas/player-summary.js";
import { PlayerStatsSchema } from "./schemas/player-stats.js";

export const queryPlayerNames = async (name: string) => {
  const encodedName = encodeURIComponent(name);

  const response = await axios(`https://overfast-api.tekrop.fr/players?name=${encodedName}?limit=25`);

  const parsedResponse = PlayerNamesSchema.safeParse(response.data);

  if (!parsedResponse.success) {
    throw "bad data";
  }

  return parsedResponse.data;
};

export const queryPlayerSummary = async (name: string) => {
  const parsedName = PlayerIdSchema.safeParse(name);

  if (!parsedName.success) {
    throw "Invalid name";
  }

  const encodedName = encodeURIComponent(parsedName.data);

  const response = await axios(`https://overfast-api.tekrop.fr/players/${encodedName}/summary`);

  if (response.status === 404) {
    // Player not found
    throw "Player name invalid, please use the auto-complete feature to search for a specific player!";
  }

  const parsedResponse = PlayerSummarySchema.safeParse(response.data);

  if (!parsedResponse.success) {
    throw "bad data";
  }

  return parsedResponse.data;
};

export const queryPlayerStats = async (name: string) => {
  const parsedName = PlayerIdSchema.safeParse(name);

  if (!parsedName.success) {
    throw "Invalid name";
  }

  const encodedName = encodeURIComponent(parsedName.data);

  const response = await axios(`https://overfast-api.tekrop.fr/players/${encodedName}/stats/summary`);

  if (response.status === 404) {
    // Player not found
  }

  const parsedResponse = PlayerStatsSchema.safeParse(response.data);

  if (!parsedResponse.success) {
    return null;
  }

  return parsedResponse.data;
};
