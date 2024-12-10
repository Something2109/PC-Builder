import {
  Controller,
  Get,
  Param,
  InternalServerErrorException,
  Post,
  Body,
  Query,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
  ParseUUIDPipe,
} from "@nestjs/common";
import { PartService } from "./part.service";
import { Products } from "@/utils/Enum";
import Part from "@/utils/interface/part/Parts";
import { FilterOptions, FilterOptionSchema } from "@/utils/interface";
import { ZodValidationPipe } from "./part.pipe";

@Controller("api/part")
export class PartController {
  constructor(private service: PartService) {}

  @Get()
  async index() {
    const responseList: {
      [key in Products]?: Part.BasicInfo[];
    } = {};

    const promises = Object.values(Products).map((product) =>
      this.service
        .list({ part: { part: [product] }, limit: 10 })
        .then((data) => (responseList[product] = data.list))
    );

    await Promise.all(promises);

    return JSON.stringify(responseList);
  }

  @Post(":part")
  async partList(
    @Param() { part }: { part: string | null },
    @Body(new ZodValidationPipe(FilterOptionSchema)) body: FilterOptions,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    if (!Object.values(Products).includes(part as Products)) {
      throw new BadRequestException(
        "Cannot find the part you need. Check if the path is correct"
      );
    }

    const options = { ...body, page, limit };
    options.part = { ...options.part, part: [part as Products] };

    let data = await this.service.list(options);

    return JSON.stringify(data);
  }

  @Get(":part/:id")
  async getPart(
    @Param("part") part: Products,
    @Param("id", new ParseUUIDPipe()) id: string
  ) {
    if (!Object.values(Products).includes(part as Products)) {
      throw new BadRequestException(
        "Cannot find the part you need. Check if the path is correct"
      );
    }

    const partInfo = await this.service.get(part as Products, id);

    if (partInfo) {
      return JSON.stringify(partInfo);
    }

    throw new NotFoundException(`Cannot find ${part} part with the id: ${id}`);
  }
}
