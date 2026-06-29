import { UnitInterface } from "@pc-builder/shared/Units";
import { z } from "zod";

export interface SchemaFieldConfig {
  type: "string" | "number" | "boolean" | "enum" | "array" | "object" | "unknown";
  options?: string[]; // For ZodEnum
  unitConfig?: {
    unit: UnitInterface<string>;
    target: string;
  };
  suffixConfig?: {
    suffix: string;
  };
  elementSchema?: z.ZodTypeAny; // For ZodArray
  isRequired: boolean;
}

export interface ZodMetadata {
  unit?: UnitInterface<string>;
  target?: string;
  suffix?: string;
}

/**
 * Recursively unwraps modifiers like ZodOptional, ZodNullable, ZodEffects, etc.
 */
export function getInnerSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  let current: z.ZodTypeAny = schema;
  while (current) {
    const name = current.constructor?.name;
    if (name === "ZodNullable" || name === "ZodOptional") {
      current = (current as unknown as { unwrap: () => z.ZodTypeAny }).unwrap();
    } else if (name === "ZodDefault") {
      current = (current as unknown as { _def: { innerType: z.ZodTypeAny } })._def.innerType;
    } else if (name === "ZodEffects" || name === "ZodPipe") {
      current = (current as unknown as { _def: { schema: z.ZodTypeAny } })._def.schema;
    } else {
      break;
    }
  }
  return current;
}

/**
 * Inspects a field's Zod schema to determine its type and configuration
 */
export function inspectFieldSchema(schema: z.ZodTypeAny): SchemaFieldConfig {
  const unwrapped = getInnerSchema(schema);
  const unwrappedName = unwrapped?.constructor?.name;

  const schemaName = schema?.constructor?.name;
  const isRequired = !(
    schemaName === "ZodOptional" ||
    schemaName === "ZodNullable" ||
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable
  );

  const meta = (typeof unwrapped.meta === "function" ? unwrapped.meta() : undefined) as
    | ZodMetadata
    | undefined;

  // 1. Check for Unit metadata
  if (meta && meta.unit && meta.target) {
    return {
      type: "number",
      unitConfig: {
        unit: meta.unit,
        target: meta.target,
      },
      isRequired,
    };
  }

  // 2. Check for Suffix metadata
  if (meta && meta.suffix) {
    return {
      type: "number",
      suffixConfig: {
        suffix: meta.suffix,
      },
      isRequired,
    };
  }

  // 3. Check basic schema types
  if (unwrappedName === "ZodString") {
    return { type: "string", isRequired };
  }
  if (unwrappedName === "ZodNumber") {
    return { type: "number", isRequired };
  }
  if (unwrappedName === "ZodBoolean") {
    return { type: "boolean", isRequired };
  }
  if (unwrappedName === "ZodEnum") {
    const enumSchema = unwrapped as unknown as { options: string[] };
    const options = enumSchema.options;
    return {
      type: "enum",
      options,
      isRequired,
    };
  }
  if (unwrappedName === "ZodArray") {
    const arraySchema = unwrapped as z.ZodArray<z.ZodTypeAny>;
    return {
      type: "array",
      elementSchema: arraySchema.element,
      isRequired,
    };
  }
  if (unwrappedName === "ZodObject") {
    return { type: "object", isRequired };
  }

  return { type: "unknown", isRequired };
}
