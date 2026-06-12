import { z } from "zod";

import { Products } from "./part";
import { RetailProductSchema } from "./retailer/Product";

export { Products };

export enum ScraperType {
  SELLERS = "sellers",
  PARTS = "parts",
}

export enum CrawlState {
  IDLE = "idle",
  CRAWLING = "crawling",
  STOPPED = "stopped",
  FAILED = "failed",
  COMPLETED = "completed",
}

const ProductSchema = z.enum(Products);

const ScraperTypeSchema = z.enum(ScraperType);

const CrawlStateSchema = z.enum(CrawlState);

export const SerializedErrorSchema = z.object({
  name: z.string(),
  message: z.string(),
  stack: z.string().optional(),
});

export const CrawlStartSchema = z.object({
  name: z.string(),
  products: z.array(ProductSchema).optional(),
});

export const CrawlStopSchema = z.object({
  name: z.string(),
});

export const CrawlTestSchema = z.object({
  name: z.string(),
  product: ProductSchema,
});

export const CrawlExtractSchema = z.object({
  name: z.string(),
  url: z.url(),
  product: ProductSchema,
});

export const CrawlIngestItemSchema = z.object({
  result: z.union([RetailProductSchema, z.record(z.string(), z.string())]),
  info: z.object({
    product: ProductSchema,
    url: z.url(),
  }),
});

export const CrawlIngestSchema = z.object({
  items: z.array(CrawlIngestItemSchema),
});

export const CrawlerProgressSchema = z.object({
  init: z.number(),
  fetch: z.number(),
  extract: z.number(),
  parse: z.number(),
  success: z.number(),
  failed: z.number(),
});

export const CrawlerSessionSchema = z.object({
  name: z.string(),
  domain: z.string(),
  type: ScraperTypeSchema,
  products: z.array(ProductSchema),
  state: CrawlStateSchema,
  progress: CrawlerProgressSchema,
  errors: z.array(SerializedErrorSchema),
  startTime: z.union([z.date(), z.string()]),
  endTime: z.union([z.date(), z.string()]).optional(),
});

export const ScraperInfoSchema = z.object({
  name: z.string(),
  domain: z.string(),
  type: ScraperTypeSchema,
  supportedProducts: z.array(ProductSchema).optional(),
});

// Infer types from Zod schemas
export type SerializedError = z.infer<typeof SerializedErrorSchema>;
export type CrawlStartPayload = z.infer<typeof CrawlStartSchema>;
export type CrawlStopPayload = z.infer<typeof CrawlStopSchema>;
export type CrawlTestPayload = z.infer<typeof CrawlTestSchema>;
export type CrawlExtractPayload = z.infer<typeof CrawlExtractSchema>;
export type CrawlIngestItem = z.infer<typeof CrawlIngestItemSchema>;
export type CrawlIngestPayload = z.infer<typeof CrawlIngestSchema>;
export type CrawlerProgress = z.infer<typeof CrawlerProgressSchema>;
export type CrawlerSession = z.infer<typeof CrawlerSessionSchema>;
export type ScraperInfo = z.infer<typeof ScraperInfoSchema>;
