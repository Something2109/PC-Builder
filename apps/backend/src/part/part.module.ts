import { Module } from "@nestjs/common";
import { CdnModule } from "src/cdn/cdn.module";

import { CRUD_INTERFACE, LIST_INTERFACE } from "./interface/database.interface";
import { PARSE_INTERFACE, PART_INTERFACE } from "./interface/part.interface";
import { PartController } from "./part.controller";
import { PartService } from "./part.service";
import { ParseService } from "./service/Parser.service";
import { SequelizeCRUDService } from "./service/SequelizeCRUD.service";
import { SequelizeListService } from "./service/SequelizeList.service";

@Module({
  imports: [CdnModule],
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
