import { Injectable, Logger } from "@nestjs/common";
import { Products } from "@/utils/Enum";
import {
  BaseDetailPartService,
  BasePartService,
} from "./interface/service.interface";

type ServiceObject = {
  [key in Products]?: BaseDetailPartService<any>;
};

@Injectable()
class PartService extends BasePartService {
  readonly logger: Logger = new Logger(PartService.name);
  readonly PartService: ServiceObject;

  constructor(...services: BaseDetailPartService<any>[]) {
    super();
    this.PartService = services.reduce((acc, service) => {
      acc[service.part] = service;
      this.logger.log(`Loaded the ${service.part} product service`);
      return acc;
    }, {} as ServiceObject);
  }
}

export { PartService };
