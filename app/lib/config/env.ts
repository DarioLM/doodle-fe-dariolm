import { z } from "zod";

/**
 * Environment variables schema definition
 * Add new environment variables here with appropriate validation
 */
const envSchema = z.object({
  // Backend API URL - must be a valid URL
  BE_API_URL: z.url({
    message: "BE_API_URL must be a valid URL (e.g., http://localhost:3000)",
  }),

  // Authentication token - required, non-empty string
  AUTH_TOKEN: z.string().min(1, {
    message: "AUTH_TOKEN is required and cannot be empty",
  }),

  // Node environment - defaults to development
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

/**
 * Validates environment variables against the schema
 * Throws an error with detailed messages if validation fails
 */
function validateEnv() {
  const parsed = envSchema.safeParse({
    BE_API_URL: process.env.BE_API_URL,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(
      JSON.stringify(z.flattenError(parsed.error).fieldErrors, null, 2),
    );
    throw new Error(
      "Invalid environment variables. Please check your .env.local file.",
    );
  }

  return parsed.data;
}

/**
 * Validated environment variables
 * This object is validated once at module load time
 * Type-safe access to all environment variables
 */
export const env = validateEnv();

/**
 * TypeScript type for environment variables
 * Automatically inferred from the Zod schema
 */
export type Env = z.infer<typeof envSchema>;
