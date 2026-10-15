import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().refine((val) => {
    if (!val) return true;
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(val);
  }, "Invalid phone number"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
  category: z.string().optional(),
  source: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const helpRequestSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  problemType: z.string().min(1, "Please describe the problem"),
  description: z.string().min(10, "Please provide more details").max(500, "Description is too long"),
  urgency: z.enum(["low", "medium", "high", "emergency"]),
  contactName: z.string().min(2, "Name must be at least 2 characters"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "either"]),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  address: z.string().optional(),
  remoteAvailable: z.boolean(),
  onsiteAvailable: z.boolean(),
  photos: z.array(z.string()).optional(),
});

export type HelpRequestData = z.infer<typeof helpRequestSchema>;

export const quoteRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  employees: z.number().min(1, "Must have at least 1 employee").max(500, "Contact us for larger teams"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  currentIT: z.string().optional(),
  budget: z.enum(["hourly", "monthly", "unsure"]),
  timeline: z.enum(["immediate", "1-month", "3-months", "6-months", "flexible"]),
  message: z.string().optional(),
});

export type QuoteRequestData = z.infer<typeof quoteRequestSchema>;
