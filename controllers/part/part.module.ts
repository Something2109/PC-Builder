import { Module } from "@nestjs/common";
import { CRUD_INTERFACE, LIST_INTERFACE } from "./interface/database.service";
import { SequelizeCRUDService } from "./service/SequelizeCRUD.service";
import { SequelizeListService } from "./service/SequelizeList.service";
import { PartController } from "./part.controller";
import { PartService } from "./part.service";
import { ProductParser } from "./parser.service";

@Module({
  controllers: [PartController],
  providers: [
    ProductParser,
    PartService,
    { provide: LIST_INTERFACE, useClass: SequelizeListService },
    { provide: CRUD_INTERFACE, useClass: SequelizeCRUDService },
  ],
})
export class PartModule {}
