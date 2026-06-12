import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import BrandModel from "@/models/parts/Brand.entity";
import * as API from "@/utils/API";

import { CreateBrandDto, UpdateBrandDto } from "./dto/brand.dto";

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(BrandModel)
    private readonly brandModel: typeof BrandModel,
  ) {}

  async list(options: API.PageOptions) {
    const validSortFields = ["id", "name", "logo_url"];
    const order: [string, string][] | undefined = options.sort_key && validSortFields.includes(options.sort_key)
      ? [[options.sort_key, options.sort_order || "asc"]]
      : undefined;

    return await this.brandModel.findAll({
      offset: (options.page - 1) * options.limit,
      limit: options.limit,
      order,
    });
  }

  async get(id: number) {
    const brand = await this.brandModel.findByPk(id);
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async create(dto: CreateBrandDto) {
    try {
      return await this.brandModel.create(dto as any);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, dto: UpdateBrandDto) {
    const brand = await this.get(id);
    try {
      await brand.update(dto as any);
      return brand;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number) {
    const brand = await this.get(id);
    await brand.destroy();
    return { success: true };
  }
}
