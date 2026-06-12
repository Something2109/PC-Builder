import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import BrandModel from "@/models/parts/Brand.entity";
import SeriesModel from "@/models/parts/Series.entity";

import { SeriesController } from "./series.controller";
import { SeriesService } from "./series.service";

@Module({
  imports: [SequelizeModule.forFeature([SeriesModel, BrandModel])],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
