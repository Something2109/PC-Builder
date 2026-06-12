import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import BrandModel from "@/models/parts/Brand.entity";

import { BrandController } from "./brand.controller";
import { BrandService } from "./brand.service";

@Module({
  imports: [SequelizeModule.forFeature([BrandModel])],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
