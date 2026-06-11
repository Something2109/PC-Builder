import { Module } from "@nestjs/common";

import { AliasModule } from "../alias/alias.module";
import { MapperService } from "./mapper.service";

@Module({
  imports: [AliasModule],
  providers: [MapperService],
  exports: [MapperService],
})
export class MapperModule {}
