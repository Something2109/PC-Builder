import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { SequelizeModule } from "@nestjs/sequelize";

import RetailProduct from "@/models/sellers/SellerProduct.entity";

import { CrawlerController } from "./crawler.controller";
import { CrawlerService } from "./crawler.service";
import { CrawlProcessLogClass, CrawlProcessLogSchema } from "./entities/CrawlProcessLog.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([RetailProduct]),
    MongooseModule.forFeature([{ name: CrawlProcessLogClass.name, schema: CrawlProcessLogSchema }]),
    ConfigModule,
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
