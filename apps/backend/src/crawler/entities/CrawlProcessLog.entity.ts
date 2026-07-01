import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Products } from "@pc-builder/shared/part";
import { HydratedDocument } from "mongoose";

export type CrawlProcessLogDocument = HydratedDocument<CrawlProcessLogClass>;

@Schema({ timestamps: true })
export class CrawlProcessLogClass {
  @Prop({ type: String, required: true, index: true })
  declare sessionId: string;

  @Prop({ type: String, required: true, index: true })
  declare scraperName: string;

  @Prop({ type: String, enum: Object.values(Products), required: true, index: true })
  declare product: Products;

  @Prop({ type: String, required: true, index: true })
  declare url: string;

  @Prop({ type: String, enum: ["SUCCESS", "FAILED"], required: true, index: true })
  declare status: "SUCCESS" | "FAILED";

  @Prop({
    type: {
      statusCode: { type: Number },
      responseTimeMs: { type: Number },
      rawPayload: { type: String },
    },
    required: true,
  })
  declare fetchStage: {
    statusCode: number;
    responseTimeMs: number;
    rawPayload?: string;
  };

  @Prop({
    type: {
      success: { type: Boolean },
      itemsCount: { type: Number },
      extractedItems: { type: [Object] },
    },
    required: true,
  })
  declare extractStage: {
    success: boolean;
    itemsCount: number;
    extractedItems?: Record<string, any>[];
  };

  @Prop({
    type: {
      success: { type: Boolean },
      parsedResult: { type: Object },
    },
    required: true,
  })
  declare parseStage: {
    success: boolean;
    parsedResult?: any;
  };

  @Prop({
    type: {
      stage: { type: String },
      message: { type: String },
      stack: { type: String },
    },
    required: false,
  })
  declare errorDetails?: {
    stage: string;
    message: string;
    stack?: string;
  };

  // TTL Index: expire after 14 days
  @Prop({ type: Date, default: Date.now, expires: "14d", index: true })
  declare createdAt: Date;

  declare updatedAt: Date;
}

export const CrawlProcessLogSchema = SchemaFactory.createForClass(CrawlProcessLogClass);
