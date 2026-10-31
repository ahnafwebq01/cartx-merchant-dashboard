import { z } from "zod";

export const customerTagSchema = z.object({
  tags: z.array(z.string().min(1, "Tag cannot be empty")),
});

export type CustomerTagFormValues = z.infer<typeof customerTagSchema>;

export const customerNoteSchema = z.object({
  note: z.string().min(1, "Note cannot be empty").max(1000, "Note too long"),
});

export type CustomerNoteFormValues = z.infer<typeof customerNoteSchema>;

export const customerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, "Please enter a valid Bangladesh mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  division: z.string().min(2, "Division is required"),
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  tags: z.array(z.string()).default([]),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

