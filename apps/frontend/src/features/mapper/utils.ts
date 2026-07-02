import { SELF_ATTRIBUTE } from "@pc-builder/shared/part";

import { KeyValueRow, MappingTrace } from "./types";

// Helper: Parse JSON string to Row array
export function jsonToRows(jsonStr: string): KeyValueRow[] {
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed !== "object" || parsed === null) return [];
    return Object.entries(parsed).map(([k, v]) => ({
      key: k,
      value: typeof v === "object" ? JSON.stringify(v, null, 2) : String(v),
    }));
  } catch {
    return [];
  }
}

// Helper: Convert Row array back to JSON string
export function rowsToJson(rows: KeyValueRow[]): string {
  const obj: Record<string, unknown> = {};
  for (const row of rows) {
    if (!row.key.trim()) continue;
    let val: unknown = row.value;
    try {
      const trimmed = row.value.trim();
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        val = JSON.parse(trimmed);
      }
    } catch {
      // If parsing as JSON fails, treat as raw string
    }
    obj[row.key.trim()] = val;
  }
  return JSON.stringify(obj, null, 2);
}

// Helper: Flatten object errors returned from backend
export function flattenErrorObject(obj: unknown, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  if (typeof obj === "string") {
    return { [prefix]: obj };
  }
  if (typeof obj !== "object" || obj === null) {
    return result;
  }
  const objRec = obj as Record<string, unknown>;
  for (const [key, value] of Object.entries(objRec)) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result[newPrefix] = value;
    } else {
      Object.assign(result, flattenErrorObject(value, newPrefix));
    }
  }
  return result;
}

// Helpers: Error path lookups
export function getErrorAtPath(
  flatErrors: Record<string, string>,
  pathStr: string
): string | undefined {
  return flatErrors[pathStr];
}

export function hasErrorInSubtree(flatErrors: Record<string, string>, prefix: string): boolean {
  return Object.keys(flatErrors).some((key) => key === prefix || key.startsWith(prefix + "."));
}

// Helpers: Mapping resolution lookup
export function findSourceRawKey(
  pathStr: string,
  mappings?: MappingTrace
): { rawKey: string; matchType: string; matchScore: number } | null {
  if (!mappings) return null;
  const parts = pathStr.split(".");
  const firstPart = parts[0];

  // 1. Check basic mappings
  if (mappings.basic) {
    const basicMatch = mappings.basic.find((m) => {
      const attr = m.attribute === "product_name" ? "name" : m.attribute;
      return attr === firstPart;
    });
    if (basicMatch) {
      return {
        rawKey: basicMatch.rawKey,
        matchType: basicMatch.matchType,
        matchScore: basicMatch.matchScore,
      };
    }
  }

  // 2. Check info mappings
  if (mappings.info) {
    const lastPart = parts[parts.length - 1];
    const infoMatch = mappings.info.find((m) => {
      // Nested array item path: mainboard_pcie.0.controller
      if (parts.length > 2 && m.info === firstPart && m.attribute === lastPart) {
        return true;
      }
      // Simple path: mainboard_pcie.controller
      if (parts.length === 2 && m.info === firstPart && m.attribute === lastPart) {
        return true;
      }
      // Info self mapping: mainboard_pcie._self
      if (m.info === firstPart && m.attribute === SELF_ATTRIBUTE) {
        return true;
      }
      return false;
    });

    if (infoMatch) {
      return {
        rawKey: infoMatch.rawKey,
        matchType: infoMatch.matchType,
        matchScore: infoMatch.matchScore,
      };
    }
  }

  return null;
}

export function findMappedDTOPath(rawKey: string, mappings?: MappingTrace): string | null {
  if (!mappings) return null;
  const targets: string[] = [];

  if (mappings.basic) {
    const basicMatches = mappings.basic.filter((m) => m.rawKey === rawKey);
    for (const m of basicMatches) {
      const attr = m.attribute === "product_name" ? "name" : m.attribute;
      targets.push(attr);
    }
  }

  if (mappings.info) {
    const infoMatches = mappings.info.filter((m) => m.rawKey === rawKey);
    for (const m of infoMatches) {
      if (m.attribute === SELF_ATTRIBUTE) {
        targets.push(m.info);
      } else {
        targets.push(`${m.info}.${m.attribute}`);
      }
    }
  }

  if (targets.length > 0) {
    return targets.join(", ");
  }
  return null;
}
