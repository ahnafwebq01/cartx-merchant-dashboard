import { z } from "zod";

/**
 * Validates and provides type-safe access to public client environment variables.
 */
const envSchema = z.object({
  appName: z.string().default("CartX"),
  appUrl: z.string().url().default("http://localhost:3000"),
  apiBaseUrl: z.string().url().default("http://localhost:5000/api/v1"),
  isDevelopment: z.boolean().default(process.env.NODE_ENV === "development"),
});

export const env = envSchema.parse({
  appName: process.env.NEXT_PUBLIC_APP_NAME || "CartX",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  isDevelopment: process.env.NODE_ENV === "development",
});

