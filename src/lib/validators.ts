import { isUsernameBanned } from "./banned-usernames";

export const USERNAME_REGEX = /^[a-z0-9._-]{3,30}$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { valid: false, error: "Username is required" };
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return { valid: false, error: `Username must be at least ${USERNAME_MIN_LENGTH} characters` };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return { valid: false, error: `Username must be at most ${USERNAME_MAX_LENGTH} characters` };
  }

  if (!USERNAME_REGEX.test(username)) {
    return {
      valid: false,
      error: "Username can only contain lowercase letters, numbers, dots, hyphens, and underscores",
    };
  }

  if (username.startsWith(".") || username.startsWith("-") || username.startsWith("_")) {
    return { valid: false, error: "Username cannot start with a special character" };
  }

  if (username.endsWith(".") || username.endsWith("-") || username.endsWith("_")) {
    return { valid: false, error: "Username cannot end with a special character" };
  }

  if (/[._-]{2,}/.test(username)) {
    return { valid: false, error: "Username cannot have consecutive special characters" };
  }

  if (isUsernameBanned(username)) {
    return { valid: false, error: "This username is not available" };
  }

  return { valid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { valid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
}

export function sanitizeUsername(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, USERNAME_MAX_LENGTH);
}
