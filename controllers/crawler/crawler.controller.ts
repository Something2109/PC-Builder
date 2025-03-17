import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  NotFoundException,
  Delete,
} from "@nestjs/common";
import { CrawlerService } from "./crawler.service";
import { Role } from "controllers/utils/role/role.decorator";
import { z } from "zod";
import { Products, Roles } from "@/utils/Enum";

@Role(Roles.ADMIN)
@Controller("crawler")
export class CrawlerController {
  constructor(private service: CrawlerService) {}

  @Get()
  getAll() {
    const list = this.service.statusAll();

    return list;
  }

  @Get(":name")
  get(@Param("name") name: string) {
    try {
      return {
        name,
        status: this.service.status(name),
      };
    } catch (err) {
      throw new NotFoundException(`No crawler specified with the name ${name}`);
    }
  }

  @Post(":name")
  start(@Param("name") name: string, @Query("product") product?: string) {
    try {
      const productList = product
        ? z.array(z.nativeEnum(Products)).parse(product?.split(","))
        : Object.values(Products);

      return {
        name,
        status: this.service.start(name, productList),
      };
    } catch (err) {
      throw new NotFoundException(`No crawler specified with the name ${name}`);
    }
  }

  @Delete(":name")
  stop(@Param("name") name: string) {
    try {
      return {
        name,
        status: this.service.stop(name),
      };
    } catch (err) {
      throw new NotFoundException(`No crawler specified with the name ${name}`);
    }
  }
}
