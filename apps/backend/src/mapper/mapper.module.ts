import { Module } from "@nestjs/common";

import { AliasModule } from "../alias/alias.module";
import { MapperController } from "./mapper.controller";
import { MapperService } from "./mapper.service";

@Module({
  imports: [AliasModule],
  controllers: [MapperController],
  providers: [MapperService],
  exports: [MapperService],
})
export class MapperModule {}
