import { z } from "zod";

import { MemoryUnits, FrequencyUnits, LengthUnits } from "../../Units";
import { getInnerSchema, getEnumOptions } from "./utils";

// Parsers for individual Zod types to keep code modular and readable

function parseNumberValue(val: any, targetKey: string, unwrapped: z.ZodNumber): number | undefined {
  if (typeof val === "number") return val;
  if (typeof val !== "string") return undefined;
  
  const str = val.trim();
  if (!str) return undefined;
  
  const lowerKey = targetKey.toLowerCase();
  
  // Memory conversions
  if (
    lowerKey.includes("capacity") ||
    lowerKey.includes("size") ||
    lowerKey.includes("cache") ||
    lowerKey.includes("tbw")
  ) {
    const parsed = MemoryUnits.parse(str);
    if (parsed) {
      const [num, unit] = parsed;
      if (num !== null) {
        if (lowerKey.includes("cache")) {
          return MemoryUnits.exchange(num, unit, "MB");
        }
        if (lowerKey.includes("tbw")) {
          return MemoryUnits.exchange(num, unit, "TB");
        }
        return MemoryUnits.exchange(num, unit, "GB");
      }
    }
  }
  
  // Frequency conversions
  if (
    lowerKey.includes("frequency") ||
    lowerKey.includes("speed") ||
    lowerKey.includes("clock")
  ) {
    const parsed = FrequencyUnits.parse(str);
    if (parsed) {
      const [num, unit] = parsed;
      if (num !== null) {
        if (lowerKey.includes("ram") || lowerKey.includes("speed")) {
          return FrequencyUnits.exchange(num, unit, "MHz");
        }
        return FrequencyUnits.exchange(num, unit, "GHz");
      }
    }
  }

  // Length conversions
  if (
    lowerKey.includes("length") ||
    lowerKey.includes("width") ||
    lowerKey.includes("height") ||
    lowerKey.includes("thickness")
  ) {
    const parsed = LengthUnits.parse(str);
    if (parsed) {
      const [num, unit] = parsed;
      if (num !== null) {
        return LengthUnits.exchange(num, unit, "mm");
      }
    }
  }

  const match = str.match(/-?\d+(?:\.\d+)?/);
  if (match) {
    return parseFloat(match[0]);
  }
  return undefined;
}

function parseDateValue(val: any): Date | undefined {
  if (val instanceof Date) return val;
  if (typeof val !== "string") return undefined;
  
  const str = val.trim();
  if (!str) return undefined;
  
  const qMatch = str.match(/Q([1-4])[ _']+(\d{2,4})/i);
  if (qMatch) {
    const quarter = parseInt(qMatch[1]);
    const yearStr = qMatch[2];
    const year = yearStr.length === 2 ? 2000 + parseInt(yearStr) : parseInt(yearStr);
    const month = (quarter - 1) * 3;
    return new Date(Date.UTC(year, month, 1));
  }
  
  const timestamp = Date.parse(str);
  if (!isNaN(timestamp)) {
    return new Date(timestamp);
  }
  return undefined;
}

function parseArrayValue(val: any, targetKey: string, unwrapped: z.ZodArray<any>): any[] | undefined {
  const elementSchema = unwrapped.element;
  const innerElement = getInnerSchema(elementSchema);
  const innerElementName = innerElement?.constructor?.name;
  
  if (innerElementName === "ZodNumber") {
    if (typeof val === "string") {
      const matches = val.match(/\d+(?:\.\d+)?/g);
      if (matches) return matches.map(Number);
    }
    if (Array.isArray(val)) {
      return val.map(v => typeof v === "number" ? v : parseFloat(String(v))).filter(v => !isNaN(v));
    }
    return undefined;
  }
  
  // Split and map array of other types
  if (typeof val === "string") {
    const items = val.split(/[|,;\n]+/).map(s => s.trim()).filter(Boolean);
    return items.map(item => parseSingleValue(item, targetKey, elementSchema)).filter(v => v !== undefined);
  }
  if (Array.isArray(val)) {
    return val.map(item => parseSingleValue(item, targetKey, elementSchema)).filter(v => v !== undefined);
  }
  return undefined;
}

function parseEnumValue(val: any, unwrapped: z.ZodEnum<any>): string | undefined {
  const options = getEnumOptions(unwrapped);
  if (typeof val === "string") {
    const cleaned = val.trim();
    const matched = options.find((opt: string) => opt.toLowerCase() === cleaned.toLowerCase());
    if (matched) return matched;
    const partialMatched = options.find((opt: string) => cleaned.toLowerCase().includes(opt.toLowerCase()));
    if (partialMatched) return partialMatched;
  }
  return undefined;
}

function parseUnionValue(val: any, targetKey: string, unwrapped: z.ZodUnion<any>): any {
  // Special treatment for HDMI names to match strict HDMISchema:
  // "HDMI 2.1a" -> "HDMI 2.1a Type A, Standard"
  if (targetKey === "name" && typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.startsWith("HDMI") && !trimmed.includes("Type") && !trimmed.includes("Standard")) {
      const match = trimmed.match(/HDMI\s*([0-9.]+([a-z])?)/i);
      if (match) {
        val = `HDMI ${match[1]} Type A, Standard`;
      }
    }
  }

  const subSchemas = unwrapped.options || [];
  for (const subSchema of subSchemas) {
    const parsed = parseSingleValue(val, targetKey, subSchema);
    if (parsed !== undefined) {
      if (subSchema.safeParse) {
        const res = subSchema.safeParse(parsed);
        if (res.success) return parsed;
      } else {
        return parsed;
      }
    }
  }
  return val;
}

function parseBooleanValue(val: any): boolean | undefined {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const s = val.toLowerCase().trim();
    if (s === "yes" || s === "true" || s === "1") return true;
    if (s === "no" || s === "false" || s === "0") return false;
  }
  return undefined;
}

// Parse a single raw value using dynamic Zod type target
export function parseSingleValue(val: any, targetKey: string, schema: z.ZodTypeAny): any {
  const unwrapped = getInnerSchema(schema);
  const unwrappedName = unwrapped?.constructor?.name;

  switch (unwrappedName) {
    case "ZodNumber":
      return parseNumberValue(val, targetKey, unwrapped as z.ZodNumber);
    case "ZodDate":
      return parseDateValue(val);
    case "ZodArray":
      return parseArrayValue(val, targetKey, unwrapped as z.ZodArray<any>);
    case "ZodEnum":
      return parseEnumValue(val, unwrapped as z.ZodEnum<any>);
    case "ZodUnion":
      return parseUnionValue(val, targetKey, unwrapped as z.ZodUnion<any>);
    case "ZodString":
      return val !== undefined && val !== null ? String(val).trim() : undefined;
    case "ZodBoolean":
      return parseBooleanValue(val);
    default:
      return val;
  }
}

// Parses count-multiplier connector strings (e.g. "3x DisplayPort 1.4a")
export function parseConnectorString(itemStr: string, elementShape: Record<string, z.ZodTypeAny>): any {
  const result: any = {};
  const match = itemStr.match(/^\s*(\d+)\s*[xX*]\s*(.+)$/);
  const properties = Object.keys(elementShape);
  
  if (match && properties.includes("count")) {
    result["count"] = parseInt(match[1]);
    const remainingVal = match[2].trim();
    
    // Distribute remaining properties
    for (const prop of properties) {
      if (prop === "count") continue;
      const innerPropSchema = getInnerSchema(elementShape[prop]);
      const parsed = parseSingleValue(remainingVal, prop, innerPropSchema);
      if (parsed !== undefined) {
        result[prop] = parsed;
      }
    }
  } else {
    if (properties.includes("count")) {
      result["count"] = 1;
    }
    for (const prop of properties) {
      if (prop === "count") continue;
      const innerPropSchema = getInnerSchema(elementShape[prop]);
      const parsed = parseSingleValue(itemStr, prop, innerPropSchema);
      if (parsed !== undefined) {
        result[prop] = parsed;
      }
    }
  }
  return result;
}
