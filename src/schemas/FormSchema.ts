// schemas/formSchemas.ts
import { z } from "zod";

export const FormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    age: z.number().min(18, "You must be at least 18 years old"),
    country: z.string().nonempty("Country is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password confirmation must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof FormSchema>;
