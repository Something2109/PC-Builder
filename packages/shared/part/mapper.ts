import { z } from "zod";

import { DTO as InfoDTOs, Name as Infos } from "./info";
import { parseSingleValue, parseConnectorString } from "./mapper/parser";
import { RawKeyResolver } from "./mapper/pipeline";
import { AliasRegistry } from "./mapper/registry";
import { IAliasRegistry, IAliasLearner, BasicMapping, ResolvedMapping } from "./mapper/types";
import { getInnerSchema } from "./mapper/utils";
import * as Mapping from "./mapping";
import { BasicInfo, DTO as PartDTO } from "./part";
import { Name as Products } from "./product";

export class RawPartMapper {
  /**
   * Maps a flat raw scraped key-value record to a validated Part DTO.
   * Supports both legacy signature and the new registry + learner signature.
   */
  static async map(
    raw: Record<string, any>,
    product: Products,
    registryOrBrand?: IAliasRegistry | string,
    learner?: IAliasLearner,
    fallbackBrand?: string
  ): Promise<any> {
    let registry: IAliasRegistry;
    let actualLearner: IAliasLearner | undefined = learner;
    let actualFallbackBrand = fallbackBrand;

    if (typeof registryOrBrand === "string" || registryOrBrand === undefined) {
      // Legacy signature: map(raw, product, fallbackBrand?)
      registry = AliasRegistry.getInstance();
      actualLearner = undefined;
      actualFallbackBrand = registryOrBrand;
    } else {
      registry = registryOrBrand;
    }

    // Phase 1+2: Resolve all raw keys
    const resolved = await RawKeyResolver.resolve(raw, product, registry, actualLearner);

    // Phase 3: Resolve conflicts
    const deduped = RawKeyResolver.resolveConflicts(resolved, raw);

    // Phase 4: Parse
    const result: Record<string, any> = { part: product };
    this.parseBasicFields(deduped.basic, raw, result);

    // Fallback for code_name if missing but name is present
    if (!result.code_name && result.name) {
      result.code_name = result.name;
    }

    this.applyBrandHeuristics(result, actualFallbackBrand);
    this.parseInfoFields(deduped.info, raw, product, result);

    return result;
  }

  /**
   * Parses BasicInfo fields based on basic mappings.
   */
  private static parseBasicFields(
    basicMappings: BasicMapping[],
    raw: Record<string, any>,
    result: Record<string, any>
  ): void {
    const basicShape = BasicInfo.omit({ id: true, part: true }).shape;
    for (const mapping of basicMappings) {
      const fieldKey = mapping.attribute === "product_name" ? "name" : mapping.attribute;
      const schema = basicShape[fieldKey as keyof typeof basicShape];
      if (schema) {
        const parsed = parseSingleValue(raw[mapping.rawKey], fieldKey, schema);
        if (parsed !== undefined) {
          result[fieldKey] = parsed;
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
   * Parses info spec fields based on resolved mappings.
   */
  private static parseInfoFields(
    infoMappings: ResolvedMapping[],
    raw: Record<string, any>,
    product: Products,
    result: Record<string, any>
  ): void {
    const allowedInfos = Mapping.Info[product] || [];

    for (const infoName of allowedInfos) {
      const infoSchema = InfoDTOs[infoName as Infos];
      if (!infoSchema) continue;

      const mappingsForInfo = infoMappings.filter((m) => m.info === infoName);
      if (mappingsForInfo.length === 0) continue;

      const unwrappedInfo = getInnerSchema(infoSchema);
      const unwrappedInfoName = unwrappedInfo?.constructor?.name;

      if (unwrappedInfoName === "ZodArray") {
        const elementSchema = (unwrappedInfo as z.ZodArray<any>).element;
        const elementUnwrapped = getInnerSchema(elementSchema);
        const elementUnwrappedName = elementUnwrapped?.constructor?.name;

        if (elementUnwrappedName === "ZodObject") {
          const elementShape = (elementUnwrapped as any).shape;
          const selfMapping = mappingsForInfo.find((m) => m.attribute === "_self");

          if (selfMapping && typeof raw[selfMapping.rawKey] === "string") {
            const rawVal = raw[selfMapping.rawKey];
            const items = rawVal
              .split(/[|,;\n]+/)
              .map((s: string) => s.trim())
              .filter(Boolean);
            const parsedArray = items.map((itemStr: string) =>
              parseConnectorString(itemStr, elementShape)
            );

            result[infoName] = parsedArray.filter(
              (obj: any) =>
                Object.keys(obj).length > 1 ||
                (Object.keys(obj).length === 1 && obj.count === undefined)
            );
          } else {
            // Discrete key mapping
            const properties = Object.keys(elementShape);
            const extractedPropertyLists: Record<string, any[]> = {};
            let maxLen = 0;

            for (const prop of properties) {
              const propMapping = mappingsForInfo.find((m) => m.attribute === prop);
              if (propMapping) {
                const rawVal = raw[propMapping.rawKey];
                const items =
                  typeof rawVal === "string"
                    ? rawVal
                        .split(/[|,;\n]+/)
                        .map((s: string) => s.trim())
                        .filter(Boolean)
                    : Array.isArray(rawVal)
                    ? rawVal
                    : [rawVal];

                const propSchema = elementShape[prop];
                const parsedItems = items
                  .map((item) => parseSingleValue(item, prop, propSchema))
                  .filter((v) => v !== undefined);

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
        }
      } else if (unwrappedInfoName === "ZodObject") {
        const shape = (unwrappedInfo as z.ZodObject<any>).shape;
        const properties = Object.keys(shape);
        const subResult: Record<string, any> = {};

        for (const prop of properties) {
          const propMapping = mappingsForInfo.find((m) => m.attribute === prop);
          if (propMapping) {
            const schema = shape[prop];
            const parsed = parseSingleValue(raw[propMapping.rawKey], prop, schema);
            if (parsed !== undefined) {
              subResult[prop] = parsed;
            }
          }
        }

        if (Object.keys(subResult).length > 0) {
          result[infoName] = subResult;
        }
      }
    }
  }

  /**
   * Maps and validates a flat raw scraped record to a Part DTO.
   * Throws ZodError if validation fails, or returns the validated DTO.
   */
  static async mapAndValidate(
    raw: Record<string, any>,
    product: Products,
    registryOrBrand?: IAliasRegistry | string,
    learner?: IAliasLearner,
    fallbackBrand?: string
  ): Promise<any> {
    const mapped = await this.map(raw, product, registryOrBrand, learner, fallbackBrand);
    return PartDTO.parse(mapped);
  }

  /**
   * Safe version of mapAndValidate. Returns { success: true, data } or { success: false, error }.
   */
  static async safeMap(
    raw: Record<string, any>,
    product: Products,
    registryOrBrand?: IAliasRegistry | string,
    learner?: IAliasLearner,
    fallbackBrand?: string
  ): Promise<any> {
    try {
      const mapped = await this.map(raw, product, registryOrBrand, learner, fallbackBrand);
      return PartDTO.safeParse(mapped);
    } catch (error: any) {
      return {
        success: false,
        error: new z.ZodError([{ path: [], message: error.message, code: "custom" }]),
      };
    }
  }
}
