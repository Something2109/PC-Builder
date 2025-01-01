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
} from "@nestjs/common";
import { PartService } from "./part.service";
import { Products } from "@/utils/Enum";
import {
  DetailInfo,
  DetailInfoOptionsSchema,
  FilterOptions,
  FilterOptionSchema,
} from "@/utils/interface";
import { ZodValidationPipe } from "controllers/utils/utils.modules";

const ProductValidator = new ParseEnumPipe(Products);
const FilterValidator = new ZodValidationPipe(FilterOptionSchema);

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
    @Query("page") page?: number,
    @Query("limit") limit?: number
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
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const service = this.findService(part);

    const options = { ...body, page, limit, q };

    let data = await service.list(options);

    return JSON.stringify(data);
  }

  @Post(":part")
  async createPart(
    @Param("part", ProductValidator) part: Products,
    @Body(new ZodValidationPipe(DetailInfoOptionsSchema))
    body: DetailInfo<Products>
  ) {
    const service = this.findService(part);

    const partInfo = await service.set(body);

    return JSON.stringify(partInfo);
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
    @Body(new ZodValidationPipe(DetailInfoOptionsSchema))
    body: DetailInfo<Products>
  ) {
    const service = this.findService(part);

    const partInfo = await service.set(body, id);

    return JSON.stringify(partInfo);
  }

  @Delete(":part/:id")
  async deletePart(
    @Param("part", ProductValidator) part: Products,
    @Param("id", ParseUUIDPipe) id: string
  ) {
    const service = this.findService(part);

    const partInfo = await service.delete(id);

    if (!partInfo) {
      throw new NotFoundException(
        `Cannot find ${part} part with the id: ${id}`
      );
    }

    return JSON.stringify(partInfo);
  }

  private findService(part: Products) {
    return this.service.PartService[part] ?? this.service;
  }
}
