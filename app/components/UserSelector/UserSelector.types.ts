export interface UserSelectorProps {
  currentUsername: string | null;
}

export type SetUsernameActionState = { error?: string } | null;
