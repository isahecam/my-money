// Shared by the Better Auth config and the client schemas, which can't import `lib/auth.ts`.
export const PASSWORD_MIN_LENGTH = 12;

export const PASSWORD_MAX_LENGTH = 128;

/** In seconds. Also shown in the reset email, so the copy can't drift from the config. */
export const RESET_PASSWORD_TOKEN_EXPIRES_IN = 60 * 60;
