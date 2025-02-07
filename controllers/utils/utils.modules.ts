import {
  Module,
  PipeTransform,
  Injectable,
  BadRequestException,
  Global,
} from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";
import { APIMapping } from "@/utils/interface/api";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private validator: ZodSchema) {}

  transform(value: any) {
    try {
      return this.validator.parse(value);
    } catch (error) {
      const err = error as ZodError;
      console.error(err);

      const body = APIMapping.toError(err.issues);

      throw new BadRequestException(body);
    }
  }
}

@Global()
@Module({
  providers: [ZodValidationPipe],
  exports: [ZodValidationPipe],
})
export class PartModule {}
