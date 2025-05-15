import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  NotFoundException,
  ParseUUIDPipe,
  Delete,
  ParseEnumPipe,
  BadRequestException,
} from "@nestjs/common";
import { ProductParser } from "./parser.service";
import { PartService } from "./part.service";
import { Products, Roles } from "@/utils/Enum";
import Part from "@/utils/interface/part";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { Role } from "controllers/utils/role/role.decorator";

const ProductValidator = new ParseEnumPipe(Products, {
  exceptionFactory: () => new NotFoundException("Product's not found"),
});
const CreateValidator = new ZodValidationPipe(
  Part.Detail.omit({ id: true, part: true })
);
const UpdateValidator = new ZodValidationPipe(Part.Detail.partial());

@Controller("part")
export class PartController {
  constructor(private service: PartService, private parser: ProductParser) {}

  @Get("filter")
  async getDefaultFilter(@Query() params: Record<string, string | string[]>) {
    const options = this.parser.options(params);

    const filter = await this.service.filter(options);

    return filter;
  }

  @Get("filter/:part")
  async getPartFilter(
    @Param("part", ProductValidator) part: Products,
    @Query() params: Record<string, string | string[]>
  ) {
    const options = this.parser.options(params, part);

    const filter = await this.service.filter(options, part);

    return this.parser.filter(filter, part);
  }

  @Get("filter/:part/:attribute")
  async getPartFilterAttribute(
    @Param("part", ProductValidator) part: Products,
    @Param("attribute") attribute: string,
    @Query() params: Record<string, string | string[]>
  ) {
    const options = this.parser.options(params, part);

    const filter = await this.service.filter(options, part, attribute);

    return this.parser.filter(filter, part);
  }

  @Get()
  async index(@Query() params: Record<string, string | string[]>) {
    const options = this.parser.options(params);

    let data = await this.service.list(options);

    return {
      list: data.list.map((part) => this.parser.summary(part)),
      total: data.total,
    };
  }

  @Get(":part")
  async partList(
    @Param("part", ProductValidator) part: Products,
    @Query() params: Record<string, string | string[]>
  ) {
    const options = this.parser.options(params, part);

    let data = await this.service.list(options, part);

    return {
      list: data.list.map((data) => this.parser.summary(data, part)),
      total: data.total,
    };
  }

  @Role(Roles.ADMIN)
  @Post(":part")
  async createPart(
    @Param("part", ProductValidator) part: Products,
    @Body(CreateValidator) body: Part.Detail
  ) {
    const partInfo = await this.service.create(part, body);

    if (typeof partInfo !== "string") {
      return partInfo;
    }

    throw new BadRequestException(
      `The part's code name ${body.code_name} is already exists in part with the id: ${partInfo}`
    );
  }

  @Get(":part/:id")
  async getPart(
    @Param("part", ProductValidator) part: Products,
    @Param("id", ParseUUIDPipe) id: string
  ) {
    const partInfo = await this.service.get(id, part);

    if (partInfo) return partInfo;

    throw new NotFoundException(`Cannot find ${part} part with the id: ${id}`);
  }

  @Role(Roles.ADMIN)
  @Post(":part/:id")
  async setPart(
    @Param("part", ProductValidator) part: Products,
    @Param("id", ParseUUIDPipe) id: string,
    @Body(UpdateValidator) body: Part.Detail
  ) {
    const partInfo = await this.service.set(id, part, body);

    if (typeof partInfo === "string") {
      throw new BadRequestException(
        `The part's code name ${body.code_name} is already exists in part with the id: ${partInfo}`
      );
    }

    if (partInfo) return partInfo;

    throw new NotFoundException(`Cannot find ${part} part with the id: ${id}`);
  }

  @Role(Roles.ADMIN)
  @Delete(":part/:id")
  async deletePart(
    @Param("part", ProductValidator) part: Products,
    @Param("id", ParseUUIDPipe) id: string
  ) {
    const partInfo = await this.service.delete(id, part);

    if (partInfo) return partInfo;

    throw new NotFoundException(`Cannot find ${part} part with the id: ${id}`);
  }
}
