import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  NotFoundException,
  BadRequestException,
  Delete,
  ParseEnumPipe,
  Inject,
  InternalServerErrorException,
  UsePipes,
} from "@nestjs/common";
import Part, { Products } from "@pc-builder/shared/part";
import { Roles } from "@pc-builder/shared/user";
import { Role } from "src/utils/role/role.decorator";
import { ZodValidationPipe } from "src/utils/utils.modules";

import { PART_INTERFACE, PartServiceInterface } from "./interface/part.interface";

const ProductValidator = new ParseEnumPipe(Products, {
  exceptionFactory: () => new NotFoundException("Product's not found"),
});

@Controller("part")
export class PartController {
  constructor(
    @Inject(PART_INTERFACE)
    private readonly service: PartServiceInterface
  ) {}

  @Get("filter")
  async getDefaultFilter(@Query() params: Record<string, string | string[]>) {
    return await this.service.filter(params);
  }

  @Get("filter/:part")
  async getPartFilter(
    @Param("part", ProductValidator) part: Products,
    @Query() params: Record<string, string | string[]>
  ) {
    return await this.service.filter(params, part);
  }

  @Get("filter/:part/:attribute")
  async getPartFilterAttribute(
    @Param("part", ProductValidator) part: Products,
    @Param("attribute") attribute: string,
    @Query() params: Record<string, string | string[]>
  ) {
    return await this.service.filter(params, part, attribute);
  }

  @Get()
  async index(@Query() params: Record<string, string | string[]>) {
    return await this.service.list(params);
  }

  @Get(":part")
  async partList(
    @Param("part", ProductValidator) part: Products,
    @Query() params: Record<string, string | string[]>
  ) {
    return await this.service.list(params, part);
  }

  @Role(Roles.ADMIN)
  @Post(":part")
  @UsePipes(new ZodValidationPipe(Part.DTO))
  async createPart(@Param("part", ProductValidator) part: Products, @Body() body: Part.DTO) {
    const partInfo = await this.service.create(part, body);

    if (typeof partInfo !== "string") {
      return partInfo;
    }

    throw new InternalServerErrorException("Failed to create new product.");
  }

  @Role(Roles.ADMIN)
  @Post(":part/bulk")
  async createPartsBulk(@Param("part", ProductValidator) product: Products, @Body() body: any[]) {
    if (!Array.isArray(body)) {
      throw new BadRequestException("Request body must be an array of parts");
    }
    if (body.length === 0) {
      throw new BadRequestException("At least one part is required");
    }

    const results: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < body.length; i++) {
      const partData = body[i];
      const parsed = Part.DTO.safeParse(partData);
      if (parsed.success) {
        try {
          const created = await this.service.create(product, parsed.data);
          if (created) {
            results.push({ index: i, id: created.id, name: created.name });
          } else {
            errors.push({
              index: i,
              data: partData,
              error: "Failed to save to database",
            });
          }
        } catch (err: any) {
          errors.push({ index: i, data: partData, error: err.message });
        }
      } else {
        errors.push({
          index: i,
          data: partData,
          error: parsed.error.issues || parsed.error.message,
        });
      }
    }

    return {
      success: true,
      importedCount: results.length,
      failedCount: errors.length,
      imported: results,
      failed: errors,
    };
  }

  @Get(":part/:idOrSlug")
  async getPart(
    @Param("part", ProductValidator) part: Products,
    @Param("idOrSlug") idOrSlug: string
  ) {
    const partInfo = await this.service.get(idOrSlug, part);

    if (partInfo) return partInfo;

    throw new NotFoundException(`Cannot find ${part} part with the ID/slug: ${idOrSlug}`);
  }

  @Role(Roles.ADMIN)
  @Post(":part/:idOrSlug")
  @UsePipes(new ZodValidationPipe(Part.DTO.partial()))
  async setPart(
    @Param("part", ProductValidator) part: Products,
    @Param("idOrSlug") idOrSlug: string,
    @Body() body: Part.DTO
  ) {
    const partInfo = await this.service.set(idOrSlug, part, body);

    if (partInfo) return partInfo;

    throw new NotFoundException(`Cannot find ${part} part with the ID/slug: ${idOrSlug}`);
  }

  @Role(Roles.ADMIN)
  @Delete(":part/:idOrSlug")
  async deletePart(
    @Param("part", ProductValidator) part: Products,
    @Param("idOrSlug") idOrSlug: string
  ) {
    const partInfo = await this.service.delete(idOrSlug, part);

    if (partInfo) return partInfo;

    throw new NotFoundException(`Cannot find ${part} part with the ID/slug: ${idOrSlug}`);
  }
}
