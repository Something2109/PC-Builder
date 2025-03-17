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
import { PartService } from "./part.service";
import { Products, Roles } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { Role } from "controllers/utils/role/role.decorator";

const ProductValidator = new ParseEnumPipe(Products, {
  exceptionFactory: () => new NotFoundException("Product's not found"),
});
const FilterValidator = new ZodValidationPipe(FilterOptions);
const CreateValidator = new ZodValidationPipe(
  DetailInfo.omit({ id: true, part: true })
);
const UpdateValidator = new ZodValidationPipe(DetailInfo.partial());

@Controller("part")
export class PartController {
  constructor(private service: PartService) {}

  @Get("filter")
  async getDefaultFilter(
    @Query() params: Record<string, string | string[]>,
    @Body(FilterValidator) body: FilterOptions
  ) {
    const service = this.service;

    const options = {
      ...body,
      ...service.options(params),
    };

    const filter = await service.filter(options);

    return filter;
  }

  @Get("filter/:part")
  async getPartFilter(
    @Param("part", ProductValidator) part: Products,
    @Query() params: Record<string, string | string[]>,
    @Body(FilterValidator) body: FilterOptions
  ) {
    const service = this.findService(part);

    const options = {
      ...body,
      ...service.options(params),
    };

    const filter = await service.filter(options);

    return filter;
  }

  @Get("filter/:part/:attribute")
  async getPartFilterAttribute(
    @Param("part", ProductValidator) part: Products,
    @Param("attribute") attribute: string,
    @Query() params: Record<string, string | string[]>,
    @Body(FilterValidator) body: FilterOptions
  ) {
    const service = this.findService(part);

    const options = {
      ...body,
      ...service.options(params),
    };

    const filter = await service.filter(options, [attribute]);

    return filter;
  }

  @Get()
  async index(
    @Body(FilterValidator) body: FilterOptions,
    @Query() params: Record<string, string | string[]>
  ) {
    const service = this.service;

    const options = { ...body, ...service.options(params) };

    let data = await service.list(options);

    return data;
  }

  @Get(":part")
  async partList(
    @Param("part", ProductValidator) part: Products,
    @Query() params: Record<string, string | string[]>,
    @Body(FilterValidator) body: FilterOptions
  ) {
    const service = this.findService(part);

    const options = { ...body, ...service.options(params) };

    let data = await service.list(options);

    return data;
  }

  @Role(Roles.ADMIN)
  @Post(":part")
  async createPart(
    @Param("part", ProductValidator) part: Products,
    @Body(CreateValidator) body: DetailInfo
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
    @Body(UpdateValidator) body: DetailInfo
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
