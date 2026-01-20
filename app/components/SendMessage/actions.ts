"use server";

import { revalidatePath } from "next/cache";
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
  const username = await getUsernameFromCookie();

  if (!username) {
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
        author: username,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    revalidatePath("/");

    return null; // Success
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message. Please try again." };
  }
}
