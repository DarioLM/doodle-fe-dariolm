import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock next/headers
const mockCookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      get: mockCookieGet,
    }),
  ),
}));

// Import after mocks
const { getUsernameFromCookie, COOKIE_NAME, COOKIE_CONFIG } = await import(
  "@/app/lib/cookies/username"
);

describe("Cookie Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("COOKIE_NAME", () => {
    it("has the correct cookie name", () => {
      expect(COOKIE_NAME).toBe("chat_username");
    });
  });

  describe("COOKIE_CONFIG", () => {
    it("sets httpOnly to true for security", () => {
      expect(COOKIE_CONFIG.httpOnly).toBe(true);
    });

    it("sets sameSite to lax", () => {
      expect(COOKIE_CONFIG.sameSite).toBe("lax");
    });

    it("sets path to root", () => {
      expect(COOKIE_CONFIG.path).toBe("/");
    });

    it("sets maxAge to 1 year in seconds", () => {
      const oneYearInSeconds = 60 * 60 * 24 * 365;
      expect(COOKIE_CONFIG.maxAge).toBe(oneYearInSeconds);
    });
  });

  describe("getUsernameFromCookie", () => {
    it("returns username when cookie exists", async () => {
      mockCookieGet.mockReturnValue({ value: "testuser" });

      const result = await getUsernameFromCookie();

      expect(mockCookieGet).toHaveBeenCalledWith("chat_username");
      expect(result).toBe("testuser");
    });

    it("returns null when cookie does not exist", async () => {
      mockCookieGet.mockReturnValue(undefined);

      const result = await getUsernameFromCookie();

      expect(result).toBeNull();
    });

    it("returns null when cookie value is empty string", async () => {
      mockCookieGet.mockReturnValue({ value: "" });

      const result = await getUsernameFromCookie();

      expect(result).toBeNull();
    });
  });
});
