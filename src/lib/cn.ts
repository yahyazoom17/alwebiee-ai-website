/** Joins class names, dropping anything falsy. Keeps conditionals readable inline. */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
