export const PHONE_PREFIX = "+961";
export const PHONE_DIGITS = 8;
export const PASSWORD_LENGTH = 8;

/**
 * Normalizes a raw phone input to "+961XXXXXXXX" format.
 * Strips all non-digit characters, removes the 961 country code if present,
 * then prepends +961. Returns "" when no local digits are present.
 */
export function normalizePhoneInput(raw: string): string {
  const allDigits = raw.replace(/\D/g, "");
  if (!allDigits) return "";
  const local = allDigits.startsWith("961") ? allDigits.slice(3) : allDigits;
  const trimmed = local.slice(0, PHONE_DIGITS);
  return trimmed ? PHONE_PREFIX + trimmed : "";
}

/**
 * Returns an error message if the phone value is invalid, or null if valid / empty.
 * Phone is treated as optional — an empty string passes.
 */
export function validatePhone(value: string): string | null {
  if (!value) return null;
  if (!/^\+961\d{8}$/.test(value))
    return `Phone number must contain exactly ${PHONE_DIGITS} digits after +961.`;
  return null;
}

/**
 * Returns an error message if the password is not exactly PASSWORD_LENGTH chars,
 * or null if valid. Empty string returns an error (password is required).
 */
export function validatePassword(value: string): string | null {
  if (value.length !== PASSWORD_LENGTH)
    return `Password must contain exactly ${PASSWORD_LENGTH} characters.`;
  return null;
}
