import { config } from "dotenv";
import z from "zod";

config();

const EnviromentSchema = z.object({
  BOT_TOKEN: z.string(),
  PORT: z.string(),
});

const env = EnviromentSchema.safeParse(process.env);

if (!env.success) {
  throw "ENV bad";
}

export default env.data;
