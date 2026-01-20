"use server";

import { revalidateTag } from "next/cache";

export async function revalidateMessages(): Promise<void> {
  revalidateTag("messages", "max");
}
