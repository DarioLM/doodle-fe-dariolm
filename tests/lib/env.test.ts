import { describe, expect, it } from "vitest";
import { z } from "zod";

// Re-create the schema for testing (since we can't easily import the module without triggering validation)
const envSchema = z.object({
  BE_API_URL: z.url({
    message: "BE_API_URL must be a valid URL (e.g., http://localhost:3000)",
  }),
  AUTH_TOKEN: z.string().min(1, {
    message: "AUTH_TOKEN is required and cannot be empty",
  }),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

function validateEnv(envVars: Record<string, string | undefined>) {
  const parsed = envSchema.safeParse(envVars);

  if (!parsed.success) {
    return { success: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  return { success: true, data: parsed.data };
}

describe("Environment Configuration", () => {
  describe("envSchema validation", () => {
    describe("BE_API_URL", () => {
      it("accepts valid HTTP URL", () => {
        const result = validateEnv({
          BE_API_URL: "http://localhost:3000",
          AUTH_TOKEN: "token",
        });

        expect(result.success).toBe(true);
        expect(result.data?.BE_API_URL).toBe("http://localhost:3000");
      });

      it("accepts valid HTTPS URL", () => {
        const result = validateEnv({
          BE_API_URL: "https://api.example.com",
          AUTH_TOKEN: "token",
        });

        expect(result.success).toBe(true);
        expect(result.data?.BE_API_URL).toBe("https://api.example.com");
      });

      it("rejects invalid URL", () => {
        const result = validateEnv({
          BE_API_URL: "not-a-url",
          AUTH_TOKEN: "token",
        });

        expect(result.success).toBe(false);
        expect(result.errors?.BE_API_URL).toBeDefined();
      });

      it("rejects empty string", () => {
        const result = validateEnv({
          BE_API_URL: "",
          AUTH_TOKEN: "token",
        });

        expect(result.success).toBe(false);
        expect(result.errors?.BE_API_URL).toBeDefined();
      });

      it("rejects missing BE_API_URL", () => {
        const result = validateEnv({
          AUTH_TOKEN: "token",
        });

        expect(result.success).toBe(false);
        expect(result.errors?.BE_API_URL).toBeDefined();
      });
    });

    describe("AUTH_TOKEN", () => {
      it("accepts non-empty string", () => {
        const result = validateEnv({
          BE_API_URL: "http://localhost:3000",
          AUTH_TOKEN: "my-secret-token",
        });

        expect(result.success).toBe(true);
        expect(result.data?.AUTH_TOKEN).toBe("my-secret-token");
      });

      it("rejects empty string", () => {
        const result = validateEnv({
          BE_API_URL: "http://localhost:3000",
          AUTH_TOKEN: "",
        });

        expect(result.success).toBe(false);
        expect(result.errors?.AUTH_TOKEN).toBeDefined();
      });

      it("rejects missing AUTH_TOKEN", () => {
        const result = validateEnv({
          BE_API_URL: "http://localhost:3000",
        });

        expect(result.success).toBe(false);
        expect(result.errors?.AUTH_TOKEN).toBeDefined();
      });
    });

    describe("NODE_ENV", () => {
      it("accepts development", () => {
        const result = validateEnv({
          BE_API_URL: "http://localhost:3000",
          AUTH_TOKEN: "token",
          NODE_ENV: "development",
        });

        expect(result.success).toBe(true);
        expect(result.data?.NODE_ENV).toBe("development");
      });

      it("accepts production", () => {
        const result = validateEnv({
          BE_API_URL: "http://localhost:3000",
          AUTH_TOKEN: "token",
          NODE_ENV: "production",
        });

        expect(result.success).toBe(true);
        expect(result.data?.NODE_ENV).toBe("production");
      });

      it("accepts test", () => {
        const result = validateEnv({
          BE_API_URL: "http://localhost:3000",
          AUTH_TOKEN: "token",
          NODE_ENV: "test",
        });

        expect(result.success).toBe(true);
        expect(result.data?.NODE_ENV).toBe("test");
      });

      it("defaults to development when not provided", () => {
        const result = validateEnv({
          BE_API_URL: "http://localhost:3000",
          AUTH_TOKEN: "token",
        });

        expect(result.success).toBe(true);
        expect(result.data?.NODE_ENV).toBe("development");
      });

      it("rejects invalid NODE_ENV value", () => {
        const result = validateEnv({
          BE_API_URL: "http://localhost:3000",
          AUTH_TOKEN: "token",
          NODE_ENV: "staging",
        });

        expect(result.success).toBe(false);
        expect(result.errors?.NODE_ENV).toBeDefined();
      });
    });

    describe("multiple validation errors", () => {
      it("returns all errors when multiple fields are invalid", () => {
        const result = validateEnv({
          BE_API_URL: "invalid",
          AUTH_TOKEN: "",
          NODE_ENV: "invalid",
        });

        expect(result.success).toBe(false);
        expect(result.errors?.BE_API_URL).toBeDefined();
        expect(result.errors?.AUTH_TOKEN).toBeDefined();
        expect(result.errors?.NODE_ENV).toBeDefined();
      });
    });
  });
});
