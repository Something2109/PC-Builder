import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  NotFoundException,
  ParseUUIDPipe,
  Delete,
  ParseEnumPipe,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";
import { PartService } from "./part.service";
import { Products } from "@/utils/Enum";
import {
  DetailInfoOptions,
  DetailInfoOptionsSchema,
  FilterOptions,
  FilterOptionSchema,
} from "@/utils/interface";
import { ZodValidationPipe } from "controllers/utils/utils.modules";

const PageOptionValidator = new ParseIntPipe({ optional: true });
const ProductValidator = new ParseEnumPipe(Products);
const FilterValidator = new ZodValidationPipe(FilterOptionSchema);
const DetailValidator = new ZodValidationPipe(DetailInfoOptionsSchema);

@Controller("api/part")
export class PartController {
  constructor(private service: PartService) {}

  @Get("filter")
  async getDefaultFilter(@Body(FilterValidator) body: FilterOptions) {
    const filter = await this.service.filter(body);

    return JSON.stringify(filter);
  }

  @Get("filter/:part")
  async getPartFilter(
    @Param("part", ProductValidator) part: Products,
    @Body(FilterValidator) body: FilterOptions
  ) {
    const service = this.findService(part);

    const filter = await service.filter(body);

    return JSON.stringify(filter);
  }

  @Get()
  async index(
    @Body(FilterValidator) body: FilterOptions,
    @Query("q") q?: string,
    @Query("page", PageOptionValidator) page?: number,
    @Query("limit", PageOptionValidator) limit?: number
  ) {
    const service = this.service;

    const options = { ...body, page, limit, q };

    let data = await service.list(options);

    return JSON.stringify(data);
  }

  @Get(":part")
  async partList(
    @Param("part", ProductValidator) part: Products,
    @Body(FilterValidator) body: FilterOptions,
    @Query("q") q?: string,
    @Query("page", PageOptionValidator) page?: number,
    @Query("limit", PageOptionValidator) limit?: number
  ) {
    const service = this.findService(part);

    const options = { ...body, page, limit, q };

    let data = await service.list(options);

    return JSON.stringify(data);
  }

  @Post(":part")
  async createPart(
    @Param("part", ProductValidator) part: Products,
    @Body(DetailValidator) body: DetailInfoOptions
  ) {
    const service = this.findService(part);

    const partInfo = await service.create(body);

    if (typeof partInfo !== "string") {
      return JSON.stringify(partInfo);
    }

    throw new BadRequestException(
      `The part's code name ${body.code_name} is already exists in part with the id: ${partInfo}`
    );
  }

  @Get(":part/:id")
  async getPart(
    @Param("part", ProductValidator) part: Products,
    @Param("id", ParseUUIDPipe) id: string
  ) {
    const service = this.findService(part);

    const partInfo = await service.get(id);

    if (partInfo) {
      return JSON.stringify(partInfo);
    }

    throw new NotFoundException(`Cannot find ${part} part with the id: ${id}`);
  }

  @Post(":part/:id")
  async setPart(
    @Param("part", ProductValidator) part: Products,
    @Param("id", ParseUUIDPipe) id: string,
    @Body(DetailValidator) body: DetailInfoOptions
  ) {
    const service = this.findService(part);

    const partInfo = await service.set(body, id);

    if (typeof partInfo === "string") {
      throw new BadRequestException(
        `The part's code name ${body.code_name} is already exists in part with the id: ${partInfo}`
      );
    }

    if (partInfo) return JSON.stringify(partInfo);

    throw new NotFoundException(`Cannot find ${part} part with the id: ${id}`);
  }

  @Delete(":part/:id")
  async deletePart(
    @Param("part", ProductValidator) part: Products,
    @Param("id", ParseUUIDPipe) id: string
  ) {
    const service = this.findService(part);

    const partInfo = await service.delete(id);

    if (partInfo) return JSON.stringify(partInfo);

    throw new NotFoundException(`Cannot find ${part} part with the id: ${id}`);
  }

  private findService(part: Products) {
    return this.service.PartService[part] ?? this.service;
  }
}
