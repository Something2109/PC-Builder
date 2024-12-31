import { Products, Topics } from "@/utils/Enum";
import {
  Module,
  PipeTransform,
  Injectable,
  BadRequestException,
  Global,
} from "@nestjs/common";
import { ZodSchema, nativeEnum } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private validator: ZodSchema) {}

  transform(value: any) {
    try {
      return this.validator.parse(value);
    } catch (error) {
      console.error(error);
      throw new BadRequestException("Validation failed");
    }
  }
}

@Global()
@Module({
  providers: [ZodValidationPipe],
  exports: [ZodValidationPipe],
})
export class PartModule {}
