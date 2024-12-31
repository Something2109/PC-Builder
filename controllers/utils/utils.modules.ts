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

@Injectable()
export class ProductValidator {
  private static validator = nativeEnum(Products);

  transform(value: any) {
    try {
      return ProductValidator.validator.parse(value);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `Validation failed: ${value} is not a valid product`
      );
    }
  }
}

@Injectable()
export class TopicValidator {
  private static validator = nativeEnum(Topics);

  transform(value: any) {
    try {
      return TopicValidator.validator.parse(value);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `Validation failed: ${value} is not a valid topic`
      );
    }
  }
}

@Global()
@Module({
  providers: [ZodValidationPipe],
  exports: [ZodValidationPipe, ProductValidator, TopicValidator],
})
export class PartModule {}
