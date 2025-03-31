import { z } from "zod";

// Addition operation
export const AdditionSchema = z.object({
  a: z.number(),
  b: z.number(),
});

// Base schemas for common types
export const ExampleSchema = z.object({
  name: z.string(),
  email: z.string(),
  date: z.string(),
});

// Export types
export type Example = z.infer<typeof ExampleSchema>;
export type Addition = z.infer<typeof AdditionSchema>;