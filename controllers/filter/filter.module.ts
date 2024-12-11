import { Module } from "@nestjs/common";
import { FilterController } from "./filter.controller";
import { PartModule } from "controllers/part/part.module";
import { PartService } from "controllers/part/part.service";

@Module({
  imports: [PartModule],
  controllers: [FilterController],
  providers: [PartService],
})
export class FilterModule {}
