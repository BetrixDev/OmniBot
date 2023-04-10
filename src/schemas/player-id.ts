import z from "zod";

export const PlayerIdSchema = z
  .string()
  .regex(/^.*[#-]\d+$/gm)
  .transform((str) => str.replace("#", "-"));
