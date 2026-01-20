"use client";

import { useActionState, useState } from "react";
import type {
  SetUsernameActionState,
  UserSelectorProps,
} from "./UserSelector.types";
import { setUsernameAction } from "./actions";

export function UserSelector({ currentUsername }: UserSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(!currentUsername);
  const [state, formAction, isPending] = useActionState<
    SetUsernameActionState,
    FormData
  >(setUsernameAction, null);

  // Collapsed state - show current user
  if (!isExpanded && currentUsername) {
    return (
      <section className="w-full h-10 px-4 py-2 border-b-4 border-primary-hover bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">
            Logged in as: <strong>{currentUsername}</strong>
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-sm text-primary hover:text-primary-hover underline"
          >
            Change
          </button>
        </div>
      </section>
    );
  }

  // Expanded state - show form
  return (
    <>
      {/** Spacer to prevent content 'jumping' as the form expands and goes absolute positioned */}
      <hr className="invisible h-10" />
      <section className="w-full p-4 border-t border-gray-300 bg-gray-50 absolute top-0 shadow-xs">
        <form
          action={(formData) => {
            setIsExpanded(false);
            formAction(formData);
          }}
          className="flex flex-col gap-2"
        >
          <label
            htmlFor="username"
            className="text-sm font-semibold text-gray-700"
          >
            {currentUsername ? "Change your username" : "Set your username"}
          </label>
          {currentUsername && (
            <p className="text-sm text-gray-500">Current: {currentUsername}</p>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your name..."
              defaultValue=""
              required
              maxLength={50}
              disabled={isPending}
              className="grow p-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 cursor-pointer bg-primary text-white rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isPending
                ? "Setting..."
                : currentUsername
                  ? "Update"
                  : "Set Username"}
            </button>
            {currentUsername && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                disabled={isPending}
                className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
        </form>
      </section>
    </>
  );
}
