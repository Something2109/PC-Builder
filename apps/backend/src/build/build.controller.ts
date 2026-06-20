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
import { ZodValidationPipe } from "src/utils/utils.modules";
import Build from "@pc-builder/shared/build";
import { Products } from "@pc-builder/shared/part";

const BuildListValidationPipe = new ZodValidationPipe(Build.Schema.nullish());
const ProductValidator = new ParseEnumPipe(Products, {
  exceptionFactory: () => new NotFoundException("Product's not found"),
});

@Controller("build")
export class BuildController {
  constructor(private readonly service: BuildService) {}

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
    @Body(BuildListValidationPipe) buildList: Build.List = {},
    @Query() params: Record<string, string | string[]>
  ) {
    return await this.service.getSuitablePart(part, buildList, params);
  }
}
