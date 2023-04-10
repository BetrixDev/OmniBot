import { z } from "zod";

import { AccountPrivacyUnion } from "./account-privacy.js";

export const PlayerNamesSchema = z.object({
  total: z.number(),
  results: z.array(
    z.object({
      player_id: z.string(),
      name: z.string(),
      privacy: AccountPrivacyUnion,
      career_url: z.string(),
    })
  ),
});
