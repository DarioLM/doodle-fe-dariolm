"use server";

import { revalidateTag } from "next/cache";
import { env } from "@/app/lib/config/env";
import { getUsernameFromCookie } from "@/app/lib/cookies/username";

export type ActionState = { error?: string } | null;

export async function sendMessageAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const message = formData.get("message");

  // Validation
  if (!message || typeof message !== "string" || message.trim() === "") {
    return { error: "Message cannot be empty" };
  }

  // Get username from cookie
  const currentUsername = await getUsernameFromCookie();

  if (!currentUsername) {
    return { error: "Please set your username before sending messages" };
  }

  try {
    const response = await fetch(`${env.BE_API_URL}/api/v1/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.trim(),
        author: currentUsername,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    revalidateTag("messages", "max");

    return null; // Success
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message. Please try again." };
  }
}
