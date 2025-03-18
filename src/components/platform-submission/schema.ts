
import * as z from "zod";

// Define form validation schema
export const platformFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(30, "Description must be at least 30 characters").max(1000, "Description cannot exceed 1000 characters"),
  logo: z.string().url("Please provide a valid URL").optional().or(z.literal('')),
  url: z.string().url("Please provide a valid URL"),
  tags: z.array(z.string()).min(1, "Please select at least one tag"),
  customTags: z.string().optional(),
  features: z.string().min(5, "Please provide at least one feature"),
  apiAvailable: z.boolean().default(false),
  pricing: z.object({
    hasFree: z.boolean().default(false),
    freeDescription: z.string().optional(),
    hasPaid: z.boolean().default(false),
    startingPrice: z.string().optional(),
  }),
});

export type PlatformFormValues = z.infer<typeof platformFormSchema>;
