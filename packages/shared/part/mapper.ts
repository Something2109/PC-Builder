import { z } from "zod";
import { BasicInfo, DTO as PartDTO } from "./part";
import { DTO as InfoDTOs, Name as Infos } from "./info";
import { Name as Products } from "./product";
import * as Mapping from "./mapping";

import { getInnerSchema, normalizeKey } from "./mapper/utils";
import { parseSingleValue, parseConnectorString } from "./mapper/parser";
import { AliasRegistry } from "./mapper/registry";
import { fuzzyMatch, fuzzyMatchBasic } from "./mapper/resolver";

// ─── Backward-compatible bridge ──────────────────────────────────────

/**
 * Bridge function: resolves a raw key for a target attribute using the
 * new product-scoped registry + fuzzy fallback.
 *
 * This will be replaced by the full RawKeyResolver pipeline in the next phase.
 */
function findMatchingRawKey(
  targetAttr: string,
  rawKeys: string[],
  product: string,
  info: string,
  raw?: Record<string, any>,
  schema?: z.ZodTypeAny
): string | undefined {
  const registry = AliasRegistry.getInstance();
  const config = registry.getConfig();

  for (const rawKey of rawKeys) {
    const normKey = normalizeKey(rawKey);

    // 1. Try reverse index lookup
    const resolved = registry.resolveKey(product, normKey);
    if (resolved) {
      const match = resolved.find(
        (t) => t.info === info && t.attribute === targetAttr
      );
      if (match) return rawKey;
    }
  }

  // 2. If no direct hit, try fuzzy matching for this specific target
  const target = { info, attribute: targetAttr };

  let bestKey: string | undefined;
  let bestScore = 0;

  for (const rawKey of rawKeys) {
    const normKey = normalizeKey(rawKey);
    const match = fuzzyMatch(normKey, [target], registry, product, config);
    if (match && match.score > bestScore) {
      bestScore = match.score;
      bestKey = rawKey;
    }
  }

  return bestKey;
}

/**
 * Bridge function for BasicInfo key resolution.
 */
function findMatchingRawKeyBasic(
  targetAttr: string,
  rawKeys: string[],
  raw?: Record<string, any>,
  schema?: z.ZodTypeAny
): string | undefined {
  const registry = AliasRegistry.getInstance();
  const config = registry.getConfig();

  // Use "product_name" as the lookup key if the mapper uses "name" → "product_name" alias
  const lookupAttr = targetAttr === "name" ? "product_name" : targetAttr;

  for (const rawKey of rawKeys) {
    const normKey = normalizeKey(rawKey);

    // 1. Try reverse index
    const resolved = registry.resolveBasicKey(normKey);
    if (resolved === lookupAttr) return rawKey;
  }

  // 2. Fuzzy fallback
  let bestKey: string | undefined;
  let bestScore = 0;

  for (const rawKey of rawKeys) {
    const normKey = normalizeKey(rawKey);
    const match = fuzzyMatchBasic(normKey, [lookupAttr], registry, config);
    if (match && match.score > bestScore) {
      bestScore = match.score;
      bestKey = rawKey;
    }
  }

  return bestKey;
}

/**
 * Bridge function for info-level matching (multi-value table lookup).
 */
function findMatchingRawKeyInfo(
  infoName: string,
  rawKeys: string[],
  product: string,
  raw?: Record<string, any>,
  schema?: z.ZodTypeAny
): string | undefined {
  const registry = AliasRegistry.getInstance();
  const config = registry.getConfig();
  const target = { info: infoName, attribute: "_self" };

  for (const rawKey of rawKeys) {
    const normKey = normalizeKey(rawKey);

    // 1. Try reverse index
    const resolved = registry.resolveKey(product, normKey);
    if (resolved) {
      const match = resolved.find(
        (t) => t.info === infoName && t.attribute === "_self"
      );
      if (match) return rawKey;
    }
  }

  // 2. Fuzzy fallback for info name
  let bestKey: string | undefined;
  let bestScore = 0;

  for (const rawKey of rawKeys) {
    const normKey = normalizeKey(rawKey);
    const match = fuzzyMatch(normKey, [target], registry, product, config);
    if (match && match.score > bestScore) {
      bestScore = match.score;
      bestKey = rawKey;
    }
  }

  return bestKey;
}

// ─── RawPartMapper ───────────────────────────────────────────────────

export class RawPartMapper {
  /**
   * Maps a flat raw scraped key-value record to a validated Part DTO.
   * @param raw Raw key-value strings from scraper.
   * @param product The Product category (CPU, GPU, RAM, etc.).
   * @param fallbackBrand Optional fallback brand name if not found.
   */
  static map(raw: Record<string, any>, product: Products, fallbackBrand?: string): any {
    const result: Record<string, any> = {
      part: product
    };

    const rawKeys = Object.keys(raw);

    // 1. Map BasicInfo fields (name, code_name, brand, series, launch_date, url, image_url)
    this.mapBasicInfo(raw, rawKeys, result);

    // 2. Fallback for code_name if missing but name is present
    if (!result.code_name && result.name) {
      result.code_name = result.name;
    }

    // 3. Heuristics for Brand if missing
    this.applyBrandHeuristics(result, fallbackBrand);

    // 4. Map Spec Info fields configured for this product
    this.mapSpecInfo(raw, rawKeys, product, result);

    return result;
  }

  /**
   * Maps fields for the BasicInfo (top-level product attributes).
   */
  private static mapBasicInfo(raw: Record<string, any>, rawKeys: string[], result: Record<string, any>): void {
    const basicShape = BasicInfo.omit({ id: true, part: true }).shape;
    const basicKeys = Object.keys(basicShape);
    
    for (const key of basicKeys) {
      const targetAttr = key === "name" ? "product_name" : key;
      const schema = basicShape[key as keyof typeof basicShape];
      const matchKey = findMatchingRawKeyBasic(targetAttr, rawKeys, raw, schema);
      if (matchKey !== undefined) {
        const parsed = parseSingleValue(raw[matchKey], key, schema);
        if (parsed !== undefined) {
          result[key] = parsed;
        }
      }
    }
  }

  /**
   * Applies brand fallback and detection heuristics if the brand is missing.
   */
  private static applyBrandHeuristics(result: Record<string, any>, fallbackBrand?: string): void {
    if (!result.brand) {
      if (fallbackBrand) {
        result.brand = fallbackBrand;
      } else {
        const name = result.name || "";
        const lowerName = name.toLowerCase();
        if (lowerName.includes("intel")) result.brand = "Intel";
        else if (lowerName.includes("amd")) result.brand = "AMD";
        else if (lowerName.includes("nvidia")) result.brand = "NVIDIA";
        else if (lowerName.includes("asus")) result.brand = "ASUS";
        else if (lowerName.includes("msi")) result.brand = "MSI";
        else if (lowerName.includes("gigabyte")) result.brand = "Gigabyte";
        else if (lowerName.includes("g.skill")) result.brand = "G.Skill";
        else if (lowerName.includes("kingston")) result.brand = "Kingston";
        else if (lowerName.includes("corsair")) result.brand = "Corsair";
        else if (lowerName.includes("lexar")) result.brand = "Lexar";
      }
    }
  }

  /**
   * Iterates through allowed info categories and maps them.
   */
  private static mapSpecInfo(raw: Record<string, any>, rawKeys: string[], product: Products, result: Record<string, any>): void {
    const allowedInfos = Mapping.Info[product] || [];
    
    for (const infoName of allowedInfos) {
      const infoSchema = InfoDTOs[infoName as Infos];
      if (!infoSchema) continue;

      const unwrappedInfo = getInnerSchema(infoSchema);
      const unwrappedInfoName = unwrappedInfo?.constructor?.name;

      if (unwrappedInfoName === "ZodArray") {
        this.mapMultipleValueInfo(infoName, raw, rawKeys, unwrappedInfo as z.ZodArray<any>, product, result);
      } else if (unwrappedInfoName === "ZodObject") {
        this.mapSingleValueInfo(infoName, raw, rawKeys, unwrappedInfo as z.ZodObject<any>, product, result);
      }
    }
  }

  /**
   * Maps MultipleValueInfo from a single combined string key (e.g. "3x DisplayPort, 2x HDMI").
   */
  private static mapMultipleValueFromSingleKey(
    infoName: string,
    rawVal: string,
    elementShape: Record<string, z.ZodTypeAny>,
    result: Record<string, any>
  ): void {
    const items = rawVal.split(/[|,;\n]+/).map((s: string) => s.trim()).filter(Boolean);
    const parsedArray = items.map((itemStr: string) => parseConnectorString(itemStr, elementShape));
    
    result[infoName] = parsedArray.filter(
      (obj: any) =>
        Object.keys(obj).length > 1 ||
        (Object.keys(obj).length === 1 && obj.count === undefined)
    );
  }

  /**
   * Maps MultipleValueInfo by extracting separate lists of values for each property.
   */
  private static mapMultipleValueFromDiscreteKeys(
    infoName: string,
    raw: Record<string, any>,
    rawKeys: string[],
    elementShape: Record<string, z.ZodTypeAny>,
    product: Products,
    result: Record<string, any>
  ): void {
    const properties = Object.keys(elementShape);
    const extractedPropertyLists: Record<string, any[]> = {};
    let maxLen = 0;

    for (const prop of properties) {
      const propSchema = elementShape[prop];
      const propMatchKey = findMatchingRawKey(prop, rawKeys, product, infoName, raw, propSchema);
      if (propMatchKey !== undefined) {
        const rawVal = raw[propMatchKey];
        const items = typeof rawVal === "string" 
          ? rawVal.split(/[|,;\n]+/).map((s: string) => s.trim()).filter(Boolean)
          : (Array.isArray(rawVal) ? rawVal : [rawVal]);
        
        const parsedItems = items.map(item => parseSingleValue(item, prop, propSchema)).filter(v => v !== undefined);
        if (parsedItems.length > 0) {
          extractedPropertyLists[prop] = parsedItems;
          maxLen = Math.max(maxLen, parsedItems.length);
        }
      }
    }

    if (maxLen > 0) {
      const list: any[] = [];
      for (let i = 0; i < maxLen; i++) {
        const obj: any = {};
        for (const prop of properties) {
          const valList = extractedPropertyLists[prop];
          if (valList) {
            if (valList[i] !== undefined) {
              obj[prop] = valList[i];
            } else if (valList[0] !== undefined) {
              obj[prop] = valList[0];
            }
          }
        }
        if (Object.keys(obj).length > 0) {
          list.push(obj);
        }
      }
      result[infoName] = list;
    }
  }

  /**
   * Handles MultipleValueInfo mapping (ZodArray elements, e.g. cpu_memory, graphic_card_external_port).
   */
  private static mapMultipleValueInfo(
    infoName: string,
    raw: Record<string, any>,
    rawKeys: string[],
    unwrappedInfo: z.ZodArray<any>,
    product: Products,
    result: Record<string, any>
  ): void {
    const elementSchema = unwrappedInfo.element;
    const elementUnwrapped = getInnerSchema(elementSchema);
    const elementUnwrappedName = elementUnwrapped?.constructor?.name;
    
    if (elementUnwrappedName === "ZodObject") {
      const elementShape = (elementUnwrapped as any).shape;
      const matchKey = findMatchingRawKeyInfo(infoName, rawKeys, product, raw, unwrappedInfo);
      
      if (matchKey !== undefined && typeof raw[matchKey] === "string") {
        this.mapMultipleValueFromSingleKey(infoName, raw[matchKey], elementShape, result);
      } else {
        this.mapMultipleValueFromDiscreteKeys(infoName, raw, rawKeys, elementShape, product, result);
      }
    }
  }

  /**
   * Handles SingleValueInfo mapping (ZodObject elements, e.g. cpu_spec, cpu_performance).
   */
  private static mapSingleValueInfo(
    infoName: string,
    raw: Record<string, any>,
    rawKeys: string[],
    unwrappedInfo: z.ZodObject<any>,
    product: Products,
    result: Record<string, any>
  ): void {
    const shape = unwrappedInfo.shape;
    const properties = Object.keys(shape);
    const subResult: Record<string, any> = {};

    for (const prop of properties) {
      const schema = shape[prop];
      const matchKey = findMatchingRawKey(prop, rawKeys, product, infoName, raw, schema);
      if (matchKey !== undefined) {
        const parsed = parseSingleValue(raw[matchKey], prop, schema);
        if (parsed !== undefined) {
          subResult[prop] = parsed;
        }
      }
    }

    if (Object.keys(subResult).length > 0) {
      result[infoName] = subResult;
    }
  }

  /**
   * Maps and validates a flat raw scraped record to a Part DTO.
   * Throws ZodError if validation fails, or returns the validated DTO.
   */
  static mapAndValidate(raw: Record<string, any>, product: Products, fallbackBrand?: string): any {
    const mapped = this.map(raw, product, fallbackBrand);
    return PartDTO.parse(mapped);
  }

  /**
   * Safe version of mapAndValidate. Returns { success: true, data } or { success: false, error }.
   */
  static safeMap(raw: Record<string, any>, product: Products, fallbackBrand?: string): any {
    try {
      const mapped = this.map(raw, product, fallbackBrand);
      return PartDTO.safeParse(mapped);
    } catch (error: any) {
      return { success: false, error: new z.ZodError([{ path: [], message: error.message, code: "custom" }]) };
    }
  }
}

