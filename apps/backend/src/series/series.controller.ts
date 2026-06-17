import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from "@nestjs/common";
import { Role } from "src/utils/role/role.decorator";
import { ZodValidationPipe } from "src/utils/utils.modules";

import * as API from "@/utils/API";
import { Roles } from "@/utils/user";

import { CreateSeriesDto, UpdateSeriesDto } from "./dto/series.dto";
import { SeriesService } from "./series.service";

const CreateValidator = new ZodValidationPipe(CreateSeriesDto);
const UpdateValidator = new ZodValidationPipe(UpdateSeriesDto);

@Controller("series")
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  async list(@Query() params: Record<string, string | string[]>) {
    const options = API.toPageOptions(params);
    const brandIdStr = Array.isArray(params.brandId) ? params.brandId[0] : params.brandId;
    const brandId = brandIdStr !== undefined ? parseInt(brandIdStr, 10) : undefined;
    const parsedBrandId = brandId !== undefined && !isNaN(brandId) ? brandId : undefined;

    return await this.seriesService.list(options, parsedBrandId);
  }

  @Get(":id")
  async get(@Param("id", ParseIntPipe) id: number) {
    return await this.seriesService.get(id);
  }

  @Role(Roles.ADMIN)
  @Post()
  @UsePipes(CreateValidator)
  async create(@Body() dto: CreateSeriesDto) {
    return await this.seriesService.create(dto);
  }

  @Role(Roles.ADMIN)
  @Put(":id")
  async update(@Param("id", ParseIntPipe) id: number, @Body(UpdateValidator) dto: UpdateSeriesDto) {
    return await this.seriesService.update(id, dto);
  }

  @Role(Roles.ADMIN)
  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.seriesService.delete(id);
  }
}
