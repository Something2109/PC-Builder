import { z } from "zod";

export const CreateAliasSchema = z.object({
  product: z.string().min(1, "Product is required"),
  info: z.string().default(""),
  attribute: z.string().min(1, "Attribute is required"),
  alias: z.string().min(1, "Alias is required"),
  source: z.enum(["seed", "learned", "manual"]).default("manual"),
  frequency: z.number().int().default(1),
  confidence: z.number().default(1.0),
});

export type CreateAliasDto = z.infer<typeof CreateAliasSchema>;

export const UpdateAliasSchema = CreateAliasSchema.partial();

export type UpdateAliasDto = z.infer<typeof UpdateAliasSchema>;

export const BulkLearnSchema = z.object({
  rawRecords: z.array(z.record(z.string(), z.any())).min(1, "At least one raw record is required"),
  product: z.string().min(1, "Product is required"),
  minCount: z.number().int().positive().default(5),
});

export type BulkLearnDto = z.infer<typeof BulkLearnSchema>;
