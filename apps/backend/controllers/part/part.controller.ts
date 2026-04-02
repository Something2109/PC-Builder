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
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  PART_INTERFACE,
  PartServiceInterface,
} from "./interface/part.interface";
import { Roles } from "@/utils/user";
import Part, { Products } from "@/utils/part";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { Role } from "controllers/utils/role/role.decorator";

const ProductValidator = new ParseEnumPipe(Products, {
  exceptionFactory: () => new NotFoundException("Product's not found"),
});
const CreateValidator = new ZodValidationPipe(Part.DTO);
const UpdateValidator = new ZodValidationPipe(Part.DTO.partial());

@Controller("part")
export class PartController {
  constructor(
    @Inject(PART_INTERFACE)
    private service: PartServiceInterface
  ) {}

  @Get("filter")
  async getDefaultFilter(@Query() params: Record<string, string | string[]>) {
    return await this.service.filter(params);
  }

  @Get("filter/:part")
  async getPartFilter(
    @Param("part", ProductValidator) part: Products,
    @Query() params: Record<string, string | string[]>
  ) {
    return await this.service.filter(params, part);
  }

  @Get("filter/:part/:attribute")
  async getPartFilterAttribute(
    @Param("part", ProductValidator) part: Products,
    @Param("attribute") attribute: string,
    @Query() params: Record<string, string | string[]>
  ) {
    return await this.service.filter(params, part, attribute);
  }

  @Get()
  async index(@Query() params: Record<string, string | string[]>) {
    return await this.service.list(params);
  }

  @Get(":part")
  async partList(
    @Param("part", ProductValidator) part: Products,
    @Query() params: Record<string, string | string[]>
  ) {
    return await this.service.list(params, part);
  }

  @Role(Roles.ADMIN)
  @Post(":part")
  async createPart(
    @Param("part", ProductValidator) part: Products,
    @Body(CreateValidator) body: Part.DTO
  ) {
    const partInfo = await this.service.create(part, body);

    if (typeof partInfo !== "string") {
      return partInfo;
    }

    throw new InternalServerErrorException("Failed to create new product.");
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
    @Body(UpdateValidator) body: Part.DTO
  ) {
    const partInfo = await this.service.set(id, part, body);

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
