import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private validator: ZodSchema) {}

  transform(value: any) {
    try {
      return this.validator.parse(value);
    } catch (error) {
      throw new BadRequestException("Validation failed");
    }
  }
}
