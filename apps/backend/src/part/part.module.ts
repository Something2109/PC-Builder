import { Module } from "@nestjs/common";

import { CRUD_INTERFACE, LIST_INTERFACE } from "./interface/database.interface";
import { PARSE_INTERFACE, PART_INTERFACE } from "./interface/part.interface";
import { PartController } from "./part.controller";
import { PartService } from "./part.service";
import { ParseService } from "./service/Parser.service";
import { SequelizeCRUDService } from "./service/SequelizeCRUD.service";
import { SequelizeListService } from "./service/SequelizeList.service";

@Module({
  controllers: [PartController],
  providers: [
    { provide: PART_INTERFACE, useClass: PartService },
    { provide: PARSE_INTERFACE, useClass: ParseService },
    { provide: LIST_INTERFACE, useClass: SequelizeListService },
    { provide: CRUD_INTERFACE, useClass: SequelizeCRUDService },
  ],
  exports: [LIST_INTERFACE, PARSE_INTERFACE],
})
export class PartModule {}
