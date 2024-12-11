import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { FilterOptions, FilterOptionSchema } from "@/utils/interface";
import { PartService } from "controllers/part/part.service";

@Controller("api/filter")
export class FilterController {
  constructor(private service: PartService) {}

  @Post()
  async partFilter(@Body() body: FilterOptions) {
    const options = FilterOptionSchema.parse(body);

    const data = await this.service.filter(options);

    if (!data) {
      throw new HttpException(
        "There's an error finding filter for your option",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return JSON.stringify(data);
  }
}
