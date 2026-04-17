import { z } from "zod";

/**
 * @file schemas.ts
 * @description Zod schemas for validation and type inference.
 */

export const ProfileSchema = z.object({
  firstName: z.string().default(""),
  lastName: z.string().default(""),
  email: z.string().email().or(z.literal("")).default(""),
  phone: z.string().default(""),
  age: z.string().default(""),
  gender: z.enum(["male", "female"]).default("male"),
  accountType: z.enum(["free", "premium"]).default("free"),
  hasSeenOnboarding: z.boolean().default(false),
  donationTotal: z.number().default(0),
});

export type ProfileData = z.infer<typeof ProfileSchema>;
