import z from "zod";

const MicroStatsSchema = z.object({
  eliminations: z.number(),
  assists: z.number(),
  deaths: z.number(),
  healing: z.number(),
});

const StatsSchema = z.object({
  games_played: z.number(),
  time_played: z.number(),
  winrate: z.number(),
  kda: z.number(),
  total: MicroStatsSchema,
  average: MicroStatsSchema,
});

export const PlayerStatsSchema = z.object({
  general: StatsSchema,
  roles: z.record(z.string(), StatsSchema),
  heroes: z.record(z.string(), StatsSchema),
});
