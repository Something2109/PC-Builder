import { Products, Topics } from "@/utils/Enum";
import {
  Module,
  PipeTransform,
  Injectable,
  BadRequestException,
  Global,
} from "@nestjs/common";
import { ZodError, ZodSchema, nativeEnum } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private validator: ZodSchema) {}

  transform(value: any) {
    try {
      return this.validator.parse(value);
    } catch (error) {
      const err = error as ZodError;
      console.error(err);

      const messages: string[] = err.issues.map((issue) => {
        let errVal = value;
        issue.path.forEach((key) => (errVal = errVal[key]));
        return `${issue.message} in [${issue.path.join("][")}]`;
      });

      throw new BadRequestException(
        `Validation failed: ${messages.join(", ")}.`
      );
    }
  }
}

@Global()
@Module({
  providers: [ZodValidationPipe],
  exports: [ZodValidationPipe],
})
export class PartModule {}
