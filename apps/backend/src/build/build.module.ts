import { Module } from "@nestjs/common";
import { BuildController } from "./build.controller";
import { BuildService } from "./build.service";
import { PartModule } from "src/part/part.module";

@Module({
  imports: [PartModule],
  controllers: [BuildController],
  providers: [BuildService],
})
export class BuildModule {}
