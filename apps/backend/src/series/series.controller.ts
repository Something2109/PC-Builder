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
import { Roles } from "@/utils/user";
import { SeriesService } from "./series.service";
import { CreateSeriesDto, UpdateSeriesDto } from "./dto/series.dto";

const CreateValidator = new ZodValidationPipe(CreateSeriesDto);
const UpdateValidator = new ZodValidationPipe(UpdateSeriesDto);

@Controller("series")
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  async list(@Query("brandId") brandId?: string) {
    const parsedBrandId = brandId !== undefined ? parseInt(brandId, 10) : undefined;
    return await this.seriesService.list(
      parsedBrandId !== undefined && !isNaN(parsedBrandId) ? parsedBrandId : undefined
    );
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
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body(UpdateValidator) dto: UpdateSeriesDto,
  ) {
    return await this.seriesService.update(id, dto);
  }

  @Role(Roles.ADMIN)
  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.seriesService.delete(id);
  }
}
