import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { FilterService } from "./filter.service";
import { Products } from "@/utils/Enum";
import { FilterOptions, FilterOptionSchema } from "@/utils/interface";

@Controller("api/filter")
export class PartController {
  constructor(private service: FilterService) {}

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
