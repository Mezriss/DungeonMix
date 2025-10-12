export function classes(...classNames: (string | boolean)[]): string {
  return classNames.filter(Boolean).join(" ");
}
