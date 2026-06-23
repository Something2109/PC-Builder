import {
  Module,
  PipeTransform,
  Injectable,
  BadRequestException,
  Global,
  Logger,
} from "@nestjs/common";
import * as API from "@pc-builder/shared/API";
import { ZodError, ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private static readonly logger = new Logger(ZodValidationPipe.name);

  constructor(private validator: ZodSchema) {}

  transform(value: any) {
    try {
      return this.validator.parse(value);
    } catch (error) {
      const err = error as ZodError;
      ZodValidationPipe.logger.error(err);

      const body = API.toError(err.issues);

      throw new BadRequestException(body);
    }
  }
}

@Global()
@Module({
  providers: [ZodValidationPipe],
  exports: [ZodValidationPipe],
})
export class UtilModule {}
