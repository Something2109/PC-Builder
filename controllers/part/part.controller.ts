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
} from "@nestjs/common";
import { PartService } from "./part.service";
import { Products } from "@/utils/Enum";
import Part from "@/utils/interface/part/Parts";
import {
  DetailInfo,
  DetailInfoOptionsSchema,
  FilterOptions,
  FilterOptionSchema,
} from "@/utils/interface";
import {
  ProductValidator,
  ZodValidationPipe,
} from "controllers/utils/utils.modules";

@Controller("api/part")
export class PartController {
  constructor(private service: PartService) {}

  @Get()
  async index() {
    const responseList: {
      [key in Products]?: Part.BasicInfo[];
    } = {};

    const promises = Object.values(Products).map((product) =>
      this.service
        .list({ part: { part: [product] }, limit: 10 })
        .then((data) => (responseList[product] = data.list))
    );

    await Promise.all(promises);

    return JSON.stringify(responseList);
  }

  @Get("filter")
  async getDefaultFilter(
    @Body(new ZodValidationPipe(FilterOptionSchema)) body: FilterOptions
  ) {
    const filter = await this.service.filter(body);

    return JSON.stringify(filter);
  }

  @Get("filter/:part")
  async getPartFilter(
    @Param("part", new ProductValidator()) part: Products,
    @Body(new ZodValidationPipe(FilterOptionSchema)) body: FilterOptions
  ) {
    const service = this.findService(part);

    const filter = await service.filter(body);

    return JSON.stringify(filter);
  }

  @Get("search")
  async searchDefault(
    @Body(new ZodValidationPipe(FilterOptionSchema)) body: FilterOptions,
    @Query() { q }: { q: string },
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const options = { ...body, page, limit, q };

    let data = await this.service.list(options);

    return JSON.stringify(data);
  }

  @Get("search/:part")
  async searchPart(
    @Param("part", new ProductValidator()) part: Products,
    @Body(new ZodValidationPipe(FilterOptionSchema)) body: FilterOptions,
    @Query() { q }: { q: string },
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const service = this.findService(part);

    const options = { ...body, page, limit, q };

    let data = await service.list(options);

    return JSON.stringify(data);
  }

  @Get(":part")
  async partList(
    @Param("part", new ProductValidator()) part: Products,
    @Body(new ZodValidationPipe(FilterOptionSchema)) body: FilterOptions,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const service = this.findService(part);

    const options = { ...body, page, limit };

    let data = await service.list(options);

    return JSON.stringify(data);
  }

  @Post(":part")
  async createPart(
    @Param("part", new ProductValidator()) part: Products,
    @Body(new ZodValidationPipe(DetailInfoOptionsSchema))
    body: DetailInfo<Products>
  ) {
    const service = this.findService(part);

    const partInfo = await service.set(body);

    return JSON.stringify(partInfo);
  }

  @Get(":part/:id")
  async getPart(
    @Param("part", new ProductValidator()) part: Products,
    @Param("id", new ParseUUIDPipe()) id: string
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
    @Param("part", new ProductValidator()) part: Products,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(DetailInfoOptionsSchema))
    body: DetailInfo<Products>
  ) {
    const service = this.findService(part);

    const partInfo = await service.set(body, id);

    return JSON.stringify(partInfo);
  }

  @Delete(":part/:id")
  async deletePart(
    @Param("part", new ProductValidator()) part: Products,
    @Param("id", new ParseUUIDPipe()) id: string
  ) {
    const service = this.service.PartService[part] ?? this.service;

    const partInfo = await service.delete(id);

    if (!partInfo) {
      throw new NotFoundException(
        `Cannot find ${part} part with the id: ${id}`
      );
    }

    return JSON.stringify(partInfo);
  }

  private findService(part: Products) {
    console.log(this.service.PartService[part]);
    return this.service.PartService[part] ?? this.service;
  }
}
