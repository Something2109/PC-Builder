import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import BrandModel from "@/models/parts/Brand.entity";
import { CreateBrandDto, UpdateBrandDto } from "./dto/brand.dto";

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(BrandModel)
    private readonly brandModel: typeof BrandModel,
  ) {}

  async list() {
    return await this.brandModel.findAll();
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
