import { z } from "zod";

// Helper to normalize keys (lowercase, alphanumeric only)
export function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function normalizeDomain(url: string) {
  return url.replaceAll(/(https:\/\/|www.|\.com|\.vn|\.)+/g, "");
}

// Levenshtein Distance for fuzzy matching typos
export function getLevenshteinDistance(a: string, b: string): number {
  const tmp: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1, // Deletion
        tmp[i][j - 1] + 1, // Insertion
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // Substitution
      );
    }
  }
  return tmp[a.length][b.length];
}

// Zod Schema Unwrapper to get core schema
export function getInnerSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  let current = schema;
  while (current) {
    const name = current.constructor?.name;
    if (name === "ZodNullable" || name === "ZodOptional") {
      current = (current as any).unwrap();
    } else if (name === "ZodDefault") {
      current = (current as any)._def.innerType;
    } else if (name === "ZodEffects" || name === "ZodPipe") {
      current = (current as any)._def.schema;
    } else {
      break;
    }
  }
  return current;
}

// Extract enum options safely from ZodEnum (supporting Zod 3 & Zod 4 shapes)
export function getEnumOptions(unwrapped: any): string[] {
  if (Array.isArray(unwrapped.options)) return unwrapped.options;
  if (unwrapped._def) {
    if (Array.isArray(unwrapped._def.values)) return unwrapped._def.values;
    if (unwrapped._def.entries && typeof unwrapped._def.entries === "object") {
      return Object.keys(unwrapped._def.entries);
    }
  }
  return [];
}
