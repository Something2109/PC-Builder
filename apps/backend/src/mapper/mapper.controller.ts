import {
  Controller,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
  ParseEnumPipe,
  NotFoundException,
} from "@nestjs/common";
import { Products } from "@pc-builder/shared/part";
import { Roles } from "@pc-builder/shared/user";
import { Role } from "src/utils/role/role.decorator";

import { MapperService } from "./mapper.service";

const ProductValidator = new ParseEnumPipe(Products, {
  exceptionFactory: () => new NotFoundException("Product's not found"),
});

@Controller("mapper")
export class MapperController {
  constructor(private readonly mapperService: MapperService) {}

  @Role(Roles.ADMIN)
  @Post("map/:part")
  async mapPart(
    @Param("part", ProductValidator) product: Products,
    @Body() body: Record<string, any> | Record<string, any>[],
    @Query("fallbackBrand") fallbackBrand?: string
  ) {
    const rawRecords = Array.isArray(body) ? body : [body];
    if (rawRecords.length === 0) {
      throw new BadRequestException("At least one raw record is required");
    }

    const results: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < rawRecords.length; i++) {
      const raw = rawRecords[i];
      const mappedResult = await this.mapperService.safeMapRawPart(raw, product, fallbackBrand);
      if (mappedResult.success) {
        results.push({ index: i, data: mappedResult.data });
      } else {
        errors.push({
          index: i,
          raw,
          error: mappedResult.error,
        });
      }
    }

    return {
      success: true,
      mappedCount: results.length,
      failedCount: errors.length,
      mapped: results,
      failed: errors,
    };
  }
}
