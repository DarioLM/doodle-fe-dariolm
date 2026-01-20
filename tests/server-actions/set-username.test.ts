import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock next/cache
vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

// Mock next/headers cookies
const mockCookieSet = vi.fn();
vi.mock("next/headers", () => ({
	cookies: vi.fn(() =>
		Promise.resolve({
			set: mockCookieSet,
		}),
	),
}));

// Mock cookie config
vi.mock("@/app/lib/cookies/username", () => ({
	COOKIE_NAME: "chat_username",
	COOKIE_CONFIG: {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 365,
		path: "/",
	},
}));

// Import after mocks are set up
const { setUsernameAction } = await import(
	"@/app/components/UserSelector/actions"
);

describe("setUsernameAction", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("validation", () => {
		it("returns error when username is empty", async () => {
			const formData = new FormData();
			formData.append("username", "");

			const result = await setUsernameAction(null, formData);

			expect(result).toEqual({ error: "Username cannot be empty" });
		});

		it("returns error when username is only whitespace", async () => {
			const formData = new FormData();
			formData.append("username", "   ");

			const result = await setUsernameAction(null, formData);

			expect(result).toEqual({ error: "Username cannot be empty" });
		});

		it("returns error when username field is missing", async () => {
			const formData = new FormData();

			const result = await setUsernameAction(null, formData);

			expect(result).toEqual({ error: "Username cannot be empty" });
		});

		it("returns error when username exceeds 50 characters", async () => {
			const formData = new FormData();
			formData.append("username", "a".repeat(51));

			const result = await setUsernameAction(null, formData);

			expect(result).toEqual({
				error: "Username must be 50 characters or less",
			});
		});

		it("accepts username with exactly 50 characters", async () => {
			const formData = new FormData();
			formData.append("username", "a".repeat(50));

			const result = await setUsernameAction(null, formData);

			expect(result).toBeNull();
		});
	});

	describe("successful username setting", () => {
		it("sets cookie with correct name and value", async () => {
			const formData = new FormData();
			formData.append("username", "testuser");

			await setUsernameAction(null, formData);

			expect(mockCookieSet).toHaveBeenCalledWith(
				"chat_username",
				"testuser",
				expect.objectContaining({
					httpOnly: true,
					sameSite: "lax",
					path: "/",
				}),
			);
		});

		it("trims username before setting cookie", async () => {
			const formData = new FormData();
			formData.append("username", "  testuser  ");

			await setUsernameAction(null, formData);

			expect(mockCookieSet).toHaveBeenCalledWith(
				"chat_username",
				"testuser",
				expect.any(Object),
			);
		});

		it("returns null on success", async () => {
			const formData = new FormData();
			formData.append("username", "testuser");

			const result = await setUsernameAction(null, formData);

			expect(result).toBeNull();
		});
	});

	describe("error handling", () => {
		it("returns error when cookie setting fails", async () => {
			mockCookieSet.mockImplementation(() => {
				throw new Error("Cookie error");
			});

			const formData = new FormData();
			formData.append("username", "testuser");

			const result = await setUsernameAction(null, formData);

			expect(result).toEqual({
				error: "Failed to set username. Please try again.",
			});
		});
	});
});
