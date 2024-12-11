import { Products } from "@/utils/Enum";
import { FilterOptions, FilterOptionSchema } from "@/utils/interface";
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  NotFoundException,
  BadRequestException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ZodValidationPipe } from "controllers/part/part.pipe";
import { PartService } from "controllers/part/part.service";

@Controller("api/search")
export class SearchController {
  constructor(private service: PartService) {}

  @Post()
  async partSearch(
    @Body(new ZodValidationPipe(FilterOptionSchema)) body: FilterOptions,
    @Query() { q }: { q: string },
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const options = { ...body, page, limit };

    let data = await this.service.search(q, options);

    return JSON.stringify(data);
  }
}
