import z from "zod";

const BaseSchema = z.object({
  username: z.string(),
  avatar: z.string().url().nullable(),
  namecard: z.string().url(),
  title: z.string().nullable(),
  endorsement: z.object({
    level: z.number(),
    frame: z.string().url(),
  }),
});

export const PlayerSummarySchema = z.discriminatedUnion("privacy", [
  z
    .object({
      privacy: z.literal("public"),
      competitive: z.record(
        z.union([z.literal("pc"), z.literal("console")]),
        z
          .record(
            z.union([z.literal("tank"), z.literal("damage"), z.literal("support")]),
            z
              .object({
                division: z.string(),
                tier: z.number(),
                role_icon: z.string().url(),
                rank_icon: z.string().url(),
              })
              .nullable()
          )
          .nullable()
      ),
    })
    .merge(BaseSchema),
  z
    .object({
      privacy: z.literal("private"),
      competitive: z.null(),
    })
    .merge(BaseSchema),
]);
