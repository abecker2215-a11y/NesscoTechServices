import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?1?\d{10}$/, "Invalid phone number (10 digits)"),
  subject: z.enum(["general", "sales", "support", "other"], {
    message: "Please select a subject",
  }),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  honeypot: z.string().optional().refine((v) => !v, "Spam detected"),
  // ISO timestamp of when the user started the form (fill-time spam trap).
  startedAt: z.string().optional(),
  referralCode: z.string().max(24).optional(),
});

export const helpRequestCategorySchema = z.enum([
  "computer",
  "wifi",
  "email",
  "m365",
  "security",
  "printer",
  "hardware",
  "business",
  "other",
]);

export const helpRequestAnswersSchema = z.record(z.string(), z.string());

export const helpRequestContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?1?\d{10}$/, "Invalid phone number (10 digits)"),
  preferredContact: z.enum(["call", "email", "text"]),
  preference: z.enum(["remote", "onsite", "either"]),
  description: z.string().min(10, "Please describe the problem (min 10 characters)").max(2000),
  preferredTime: z.string().optional(),
  honeypot: z.string().optional().refine((v) => !v, "Spam detected"),
  referralCode: z.string().max(24).optional(),
});

export const helpRequestSchema = z.object({
  category: helpRequestCategorySchema,
  answers: helpRequestAnswersSchema,
  photos: z.array(z.string().max(1_500_000)).max(3).optional(),
  photoNames: z.array(z.string().max(120)).max(3).optional(),
  // ISO timestamp of when the user started step 1 (fill-time spam trap).
  startedAt: z.string().optional(),
  contact: helpRequestContactSchema,
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type HelpRequestData = z.infer<typeof helpRequestSchema>;
export type HelpRequestContactData = z.infer<typeof helpRequestContactSchema>;