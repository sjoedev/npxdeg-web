import { z } from "astro/zod";

const normalize = <T>(value: T | null | undefined): T | undefined => value ?? undefined;

export const PlantCardSchema = z.object({
  id: z.number(),
  commonName: z.string(),
  slug: z.string(),
  binomial: z.string(),
  imageId: z.string().nullish().transform(normalize),
});

export type PlantCard = z.infer<typeof PlantCardSchema>;

const jsonStringArray = z
  .string()
  .nullish()
  .transform((s) => s ?? "[]") // TODO: hack?
  .transform((s, ctx) => {
    try {
      return JSON.parse(s);
    } catch {
      ctx.addIssue({ code: "custom", message: "Column is not valid JSON" });
      return z.NEVER;
    }
  })
  .pipe(z.array(z.string()));

export const PlantSchema = z.object({
  id: z.int(),
  commonName: z.string(),
  slug: z.string(),
  binomial: z.string().trim(),
  imageId: z.string().nullish().transform(normalize),
  minHeightInches: z.number().int().nullish().transform(normalize),
  maxHeightInches: z.number().int().nullish().transform(normalize),
  heightDisplayFeet: z.preprocess((x) => x !== 0, z.boolean()),
  notes: z.string().nullish().transform(normalize),
  prefsLight: jsonStringArray,
  prefsMoisture: jsonStringArray,
  bloomSeasons: jsonStringArray,
  toxicity: jsonStringArray,
});

export type Plant = z.infer<typeof PlantSchema>;
