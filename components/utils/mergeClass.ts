export function mergeClass(defaultClass: string, className?: string) {
  return `${defaultClass} ${className || ""}`.trim();
}
