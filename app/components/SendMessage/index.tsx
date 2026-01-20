"use client";

import { useActionState } from "react";
import type { ActionState } from "./actions";
import { sendMessageAction } from "./actions";

export interface SendMessageProps {
  currentUsername: string | null;
}

export function SendMessage({ currentUsername }: SendMessageProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    sendMessageAction,
    null,
  );

  const isDisabled = isPending || !currentUsername;

  return (
    <section className="w-full p-2 md:p-4 border-t border-gray-300 bg-primary-light">
      <form action={formAction} className="flex gap-2 md:gap-4">
        <input
          type="text"
          name="message"
          placeholder={
            currentUsername ? "Type here..." : "Set your username first..."
          }
          aria-label="Chat message input"
          disabled={isDisabled}
          className="grow p-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={isDisabled}
          className="px-4 py-2 cursor-pointer bg-primary text-white rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </form>
      {state?.error && (
        <p className="mt-2 text-sm text-red-600">{state.error}</p>
      )}
      {!currentUsername && !state?.error && (
        <p className="mt-2 text-sm text-gray-600">
          Please set your username above to start chatting
        </p>
      )}
    </section>
  );
}
