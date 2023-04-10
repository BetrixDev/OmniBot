import { z } from "zod";

export const AccountPrivacyUnion = z.union([
  z.literal("private"),
  z.literal("public"),
]);
