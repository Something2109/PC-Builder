import { Module } from "@nestjs/common";
import { PartController } from "./part.controller";
import { PartService } from "./part.service";
import { BaseDetailPartService } from "./interface/service.interface";
import { CPUService } from "./service/cpu.service";
import { GPUService } from "./service/gpu.service";
import { GraphicCardService } from "./service/graphic_card.service";
import { MainboardService } from "./service/mainboard.service";
import { RAMService } from "./service/ram.service";
import { SSDService } from "./service/ssd.service";
import { HDDService } from "./service/hdd.service";
import { PSUService } from "./service/psu.service";
import { CaseService } from "./service/case.service";
import { CoolerService } from "./service/cooler.service";
import { AIOService } from "./service/aio.service";
import { FanService } from "./service/fan.service";
import { CPUBlockService } from "./service/cpublock.service";
import { PumpService } from "./service/pump.service";
import { RadiatorService } from "./service/radiator.service";
import { ProductParser } from "./parser.service";

const Service = {
  provide: PartService,
  useFactory: (...service: BaseDetailPartService<any>[]) => {
    return new PartService(...service);
  },
  inject: [
    CPUService,
    GPUService,
    GraphicCardService,
    MainboardService,
    RAMService,
    SSDService,
    HDDService,
    PSUService,
    CaseService,
    CoolerService,
    AIOService,
    FanService,
    CPUBlockService,
    PumpService,
    RadiatorService,
  ],
};

@Module({
  controllers: [PartController],
  providers: [
    Service,
    ProductParser,
    CPUService,
    GPUService,
    GraphicCardService,
    MainboardService,
    RAMService,
    SSDService,
    HDDService,
    PSUService,
    CaseService,
    CoolerService,
    AIOService,
    FanService,
    CPUBlockService,
    PumpService,
    RadiatorService,
  ],
})
export class PartModule {}
