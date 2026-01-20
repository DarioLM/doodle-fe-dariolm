"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { COOKIE_CONFIG, COOKIE_NAME } from "@/app/lib/cookies/username";
import type { SetUsernameActionState } from "./UserSelector.types";

export async function setUsernameAction(
  _prevState: SetUsernameActionState,
  formData: FormData,
): Promise<SetUsernameActionState> {
  const username = formData.get("username");

  // Validation
  if (!username || typeof username !== "string" || username.trim() === "") {
    return { error: "Username cannot be empty" };
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length > 50) {
    return { error: "Username must be 50 characters or less" };
  }

  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, trimmedUsername, COOKIE_CONFIG);

    revalidatePath("/", "layout");

    return null; // Success
  } catch (error) {
    console.error("Error setting username cookie:", error);
    return { error: "Failed to set username. Please try again." };
  }
}
