import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as API from "@pc-builder/shared/API";

import BrandModel from "@/models/parts/Brand.entity";
import SeriesModel from "@/models/parts/Series.entity";

import { CreateSeriesDto, UpdateSeriesDto } from "./dto/series.dto";

@Injectable()
export class SeriesService {
  constructor(
    @InjectModel(SeriesModel)
    private readonly seriesModel: typeof SeriesModel,
    @InjectModel(BrandModel)
    private readonly brandModel: typeof BrandModel
  ) {}

  async list(options: API.PageOptions, brandId?: number) {
    const where: any = {};
    if (brandId !== undefined) {
      where.brandId = brandId;
    }

    const validSortFields = ["id", "name", "brandId"];
    const order: [string, string][] | undefined =
      options.sort_key && validSortFields.includes(options.sort_key)
        ? [[options.sort_key, options.sort_order || "asc"]]
        : undefined;

    return await this.seriesModel.findAll({
      where,
      include: [{ model: this.brandModel, attributes: ["name"] }],
      offset: (options.page - 1) * options.limit,
      limit: options.limit,
      order,
    });
  }

  async get(id: number) {
    const series = await this.seriesModel.findByPk(id, {
      include: [{ model: this.brandModel, attributes: ["name"] }],
    });
    if (!series) {
      throw new NotFoundException(`Series with ID ${id} not found`);
    }
    return series;
  }

  async create(dto: CreateSeriesDto) {
    // Verify brand exists
    const brand = await this.brandModel.findByPk(dto.brandId);
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${dto.brandId} not found`);
    }

    try {
      return await this.seriesModel.create(dto as any);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, dto: UpdateSeriesDto) {
    const series = await this.get(id);

    if (dto.brandId !== undefined) {
      const brand = await this.brandModel.findByPk(dto.brandId);
      if (!brand) {
        throw new NotFoundException(`Brand with ID ${dto.brandId} not found`);
      }
    }

    try {
      await series.update(dto as any);
      return series;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number) {
    const series = await this.get(id);
    await series.destroy();
    return { success: true };
  }
}
