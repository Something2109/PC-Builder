import {
  Controller,
  Get,
  Param,
  InternalServerErrorException,
  Post,
  Body,
  Query,
  NotFoundException,
  BadRequestException,
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
import { ZodValidationPipe } from "controllers/utils/utils.modules";

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

  @Post()
  async createPart(
    @Body(new ZodValidationPipe(DetailInfoOptionsSchema))
    { id, ...body }: DetailInfo<Products>
  ) {
    try {
      const responseList = await this.service.set(body, id);

      return JSON.stringify(responseList);
    } catch (err: any) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Delete()
  async deletePart(@Body() { id }: { id: string }) {
    const responseList = await this.service.delete(id);
    if (!responseList) {
      return new NotFoundException(`No product found with the given ${id}`);
    }

    return JSON.stringify(responseList);
  }

  @Post("filter")
  async getPartFilter(
    @Body(new ZodValidationPipe(FilterOptionSchema)) body: FilterOptions
  ) {
    const data = await this.service.filter(body);

    if (!data) {
      throw new InternalServerErrorException(
        "There's an error finding filter for your option"
      );
    }

    return JSON.stringify(data);
  }

  @Post("search")
  async partSearch(
    @Body(new ZodValidationPipe(FilterOptionSchema)) body: FilterOptions,
    @Query() { q }: { q: string },
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const options = { ...body, page, limit };

    let data = await this.service.search(q, options);

    return JSON.stringify(data);
  }

  @Post(":part")
  async partList(
    @Param() { part }: { part: string | null },
    @Body(new ZodValidationPipe(FilterOptionSchema)) body: FilterOptions,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    if (!Object.values(Products).includes(part as Products)) {
      throw new BadRequestException(
        "Cannot find the part you need. Check if the path is correct"
      );
    }

    const options = { ...body, page, limit };
    options.part = { ...options.part, part: [part as Products] };

    let data = await this.service.list(options);

    return JSON.stringify(data);
  }

  @Get(":part/:id")
  async getPart(
    @Param("part") part: Products,
    @Param("id", new ParseUUIDPipe()) id: string
  ) {
    if (!Object.values(Products).includes(part as Products)) {
      throw new BadRequestException(
        "Cannot find the part you need. Check if the path is correct"
      );
    }

    const service = this.service.PartService[part] ?? this.service;

    const partInfo = await service.get(id);

    if (partInfo) {
      return JSON.stringify(partInfo);
    }

    throw new NotFoundException(`Cannot find ${part} part with the id: ${id}`);
  }
}
