import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock next/cache
vi.mock("next/cache", () => ({
	revalidateTag: vi.fn(),
}));

// Mock the env module
vi.mock("@/app/lib/config/env", () => ({
	env: {
		BE_API_URL: "http://localhost:3000",
		AUTH_TOKEN: "test-token",
		NODE_ENV: "test",
	},
}));

// Mock the cookie utility
const mockGetUsernameFromCookie = vi.fn();
vi.mock("@/app/lib/cookies/username", () => ({
	getUsernameFromCookie: () => mockGetUsernameFromCookie(),
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Import after mocks are set up
const { sendMessageAction } = await import(
	"@/app/components/SendMessage/actions"
);

describe("sendMessageAction", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetUsernameFromCookie.mockResolvedValue("testuser");
		mockFetch.mockResolvedValue({ ok: true });
	});

	describe("validation", () => {
		it("returns error when message is empty", async () => {
			const formData = new FormData();
			formData.append("message", "");

			const result = await sendMessageAction(null, formData);

			expect(result).toEqual({ error: "Message cannot be empty" });
		});

		it("returns error when message is only whitespace", async () => {
			const formData = new FormData();
			formData.append("message", "   ");

			const result = await sendMessageAction(null, formData);

			expect(result).toEqual({ error: "Message cannot be empty" });
		});

		it("returns error when message field is missing", async () => {
			const formData = new FormData();

			const result = await sendMessageAction(null, formData);

			expect(result).toEqual({ error: "Message cannot be empty" });
		});
	});

	describe("username validation", () => {
		it("returns error when username cookie is not set", async () => {
			mockGetUsernameFromCookie.mockResolvedValue(null);

			const formData = new FormData();
			formData.append("message", "Hello world");

			const result = await sendMessageAction(null, formData);

			expect(result).toEqual({
				error: "Please set your username before sending messages",
			});
		});
	});

	describe("successful message sending", () => {
		it("sends message to API with correct payload", async () => {
			const formData = new FormData();
			formData.append("message", "Hello world");

			await sendMessageAction(null, formData);

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:3000/api/v1/messages",
				{
					method: "POST",
					headers: {
						Authorization: "Bearer test-token",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						message: "Hello world",
						author: "testuser",
					}),
				},
			);
		});

		it("trims message before sending", async () => {
			const formData = new FormData();
			formData.append("message", "  Hello world  ");

			await sendMessageAction(null, formData);

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					body: JSON.stringify({
						message: "Hello world",
						author: "testuser",
					}),
				}),
			);
		});

		it("returns null on success", async () => {
			const formData = new FormData();
			formData.append("message", "Hello world");

			const result = await sendMessageAction(null, formData);

			expect(result).toBeNull();
		});
	});

	describe("error handling", () => {
		it("returns error when API response is not ok", async () => {
			mockFetch.mockResolvedValue({ ok: false });

			const formData = new FormData();
			formData.append("message", "Hello world");

			const result = await sendMessageAction(null, formData);

			expect(result).toEqual({
				error: "Failed to send message. Please try again.",
			});
		});

		it("returns error when fetch throws", async () => {
			mockFetch.mockRejectedValue(new Error("Network error"));

			const formData = new FormData();
			formData.append("message", "Hello world");

			const result = await sendMessageAction(null, formData);

			expect(result).toEqual({
				error: "Failed to send message. Please try again.",
			});
		});
	});
});
