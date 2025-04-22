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
    const service = this.service;

    const options = this.parser.options(params);

    const filter = await service.filter(options);

    return filter;
  }

  @Get("filter/:part")
  async getPartFilter(
    @Param("part", ProductValidator) part: Products,
    @Query() params: Record<string, string | string[]>
  ) {
    const service = this.findService(part);

    const options = this.parser.options(params, part);

    const filter = await service.filter(options);

    return filter;
  }

  @Get("filter/:part/:attribute")
  async getPartFilterAttribute(
    @Param("part", ProductValidator) part: Products,
    @Param("attribute") attribute: string,
    @Query() params: Record<string, string | string[]>
  ) {
    const service = this.findService(part);

    const options = this.parser.options(params, part);

    const filter = await service.filter(options, [attribute]);

    return filter;
  }

  @Get()
  async index(@Query() params: Record<string, string | string[]>) {
    const service = this.service;

    const options = this.parser.options(params);

    let data = await service.list(options);

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
    const service = this.findService(part);

    const options = this.parser.options(params, part);

    let data = await service.list(options);

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
    const service = this.findService(part);

    const partInfo = await service.create(body);

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
    const service = this.findService(part);

    const partInfo = await service.get(id);

    if (partInfo) {
      return partInfo;
    }

    throw new NotFoundException(`Cannot find ${part} part with the id: ${id}`);
  }

  @Role(Roles.ADMIN)
  @Post(":part/:id")
  async setPart(
    @Param("part", ProductValidator) part: Products,
    @Param("id", ParseUUIDPipe) id: string,
    @Body(UpdateValidator) body: Part.Detail
  ) {
    const service = this.findService(part);

    const partInfo = await service.set(body, id);

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
    const service = this.findService(part);

    const partInfo = await service.delete(id);

    if (partInfo) return partInfo;

    throw new NotFoundException(`Cannot find ${part} part with the id: ${id}`);
  }

  private findService(part: Products) {
    return this.service.PartService[part] ?? this.service;
  }
}
