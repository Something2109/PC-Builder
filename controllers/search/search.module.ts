import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { PartModule } from "controllers/part/part.module";

@Module({
  imports: [PartModule],
  controllers: [SearchController],
})
export class SearchModule {}
