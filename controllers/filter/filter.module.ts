import { Module } from "@nestjs/common";
import { PartController } from "./filter.controller";
import { FilterService } from "./filter.service";

@Module({
  controllers: [PartController],
  providers: [FilterService],
})
export class FilterModule {}
