/** Returns true if the string is an emoji character (not an old Lucide icon name). */
export function isEmoji(value: string | null | undefined): value is string {
  if (!value) return false;
  // Old Lucide icon names are ASCII-only (e.g. "sparkles", "shopping-cart")
  // Emoji characters have code points > 255
  return value.codePointAt(0)! > 255;
}
