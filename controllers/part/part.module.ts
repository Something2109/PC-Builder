import { Module } from "@nestjs/common";
import { PartController } from "./part.controller";
import { PartService } from "./part.service";
import { BasePartService } from "./interface/service.interface";

const Service = {
  provide: PartService,
  useFactory: (...service: BasePartService[]) => {
    return new PartService(...service);
  },
  inject: [],
};

@Module({
  controllers: [PartController],
  providers: [Service],
})
export class PartModule {}
