import {
  Controller,
  Param,
  Post,
  Body,
  Query,
  NotFoundException,
  ParseEnumPipe,
} from "@nestjs/common";
import { BuildService } from "./build.service";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import Build from "@/utils/interface/build";
import { Products } from "@/utils/Enum";

const BuildListValidationPipe = new ZodValidationPipe(Build.Schema);
const ProductValidator = new ParseEnumPipe(Products, {
  exceptionFactory: () => new NotFoundException("Product's not found"),
});

@Controller("build")
export class BuildController {
  constructor(private service: BuildService) {}

  @Post()
  async getSummary(@Body(BuildListValidationPipe) buildList: Build.List) {
    return await this.service.getPartDetails(buildList);
  }

  @Post("validate")
  async validate(@Body(BuildListValidationPipe) buildList: Build.List) {
    return await this.service.validate(buildList);
  }

  @Post(":product")
  async getSuitablePart(
    @Param("product", ProductValidator) part: Products,
    @Body(BuildListValidationPipe) buildList: Build.List,
    @Query() params: Record<string, string | string[]>
  ) {
    return await this.service.getSuitablePart(part, buildList, params);
  }
}
