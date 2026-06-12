import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

import RetailProduct from "@/models/sellers/SellerProduct.entity";

import { CrawlerController } from "./crawler.controller";
import { CrawlerService } from "./crawler.service";

@Module({
  imports: [
    SequelizeModule.forFeature([RetailProduct]),
    ConfigModule,
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
