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

import { BrandService } from "./brand.service";
import { CreateBrandDto, UpdateBrandDto } from "./dto/brand.dto";

const CreateValidator = new ZodValidationPipe(CreateBrandDto);
const UpdateValidator = new ZodValidationPipe(UpdateBrandDto);

@Controller("brand")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async list(@Query() params: Record<string, string | string[]>) {
    const options = API.toPageOptions(params);
    return await this.brandService.list(options);
  }

  @Get(":id")
  async get(@Param("id", ParseIntPipe) id: number) {
    return await this.brandService.get(id);
  }

  @Role(Roles.ADMIN)
  @Post()
  @UsePipes(CreateValidator)
  async create(@Body() dto: CreateBrandDto) {
    return await this.brandService.create(dto);
  }

  @Role(Roles.ADMIN)
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body(UpdateValidator) dto: UpdateBrandDto,
  ) {
    return await this.brandService.update(id, dto);
  }

  @Role(Roles.ADMIN)
  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.brandService.delete(id);
  }
}
