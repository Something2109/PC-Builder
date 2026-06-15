import { Products } from "@pc-builder/shared";
import { z } from "zod";

// 1. Schema for list_parts
export const ListPartsSchema = z.object({
  product: z.nativeEnum(Products).optional().describe("The product category (e.g., cpu, mainboard, etc.)"),
  q: z.string().optional().describe("Search query string to filter parts by name or brand"),
  page: z.number().optional().describe("Page number for pagination (default: 1)"),
  limit: z.number().optional().describe("Number of items per page (default: 50)"),
  sort_key: z.string().optional().describe("Field to sort the results by"),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Order to sort results (asc or desc)"),
  filters: z.record(z.string(), z.string()).optional().describe("Key-value pair filter constraints specific to the product type (e.g., brand: 'Intel', socket: 'LGA1700')"),
});

export type ListPartsInput = z.infer<typeof ListPartsSchema>;

// 2. Schema for get_part_details
export const GetPartDetailsSchema = z.object({
  product: z.nativeEnum(Products).describe("The product category"),
  id: z.uuid().describe("The unique UUID of the PC part"),
});

export type GetPartDetailsInput = z.infer<typeof GetPartDetailsSchema>;

// Shared component list for validation and recommendation
export const BuildListSchema = z.object({
  cpu: z.uuid().optional().describe("CPU UUID"),
  mainboard: z.uuid().optional().describe("Motherboard UUID"),
  psu: z.uuid().optional().describe("PSU UUID"),
  case: z.uuid().optional().describe("Case UUID"),
  cooler: z.uuid().optional().describe("Air Cooler UUID"),
  aio: z.uuid().optional().describe("AIO Cooler UUID"),
  cpu_block: z.uuid().optional().describe("Waterblock UUID"),
  pump: z.uuid().optional().describe("Waterpump UUID"),
  radiator: z.uuid().optional().describe("Radiator UUID"),
  graphic_card: z.array(z.uuid()).optional().describe("List of Graphic Card UUIDs"),
  ram: z.array(z.uuid()).optional().describe("List of RAM UUIDs"),
  ssd: z.array(z.uuid()).optional().describe("List of SSD UUIDs"),
  hdd: z.array(z.uuid()).optional().describe("List of HDD UUIDs"),
  fan: z.array(z.uuid()).optional().describe("List of Fan UUIDs"),
});

export type BuildListInput = z.infer<typeof BuildListSchema>;

// 3. Schema for validate_build
export const ValidateBuildSchema = z.object({
  build_list: BuildListSchema.describe("PC build configuration. Maps product types to their component UUID(s)."),
});

export type ValidateBuildInput = z.infer<typeof ValidateBuildSchema>;

// 4. Schema for get_suitable_parts
export const GetSuitablePartsSchema = z.object({
  product: z.nativeEnum(Products).describe("The product category to find suitable parts for"),
  build_list: BuildListSchema.describe("The current list of selected component UUIDs (same format as validate_build)"),
  page: z.number().optional().describe("Page number (default: 1)"),
  limit: z.number().optional().describe("Page limit (default: 50)"),
  q: z.string().optional().describe("Search query for part name"),
  filters: z.record(z.string(), z.string()).optional().describe("Additional constraints specific to the product category"),
});

export type GetSuitablePartsInput = z.infer<typeof GetSuitablePartsSchema>;
