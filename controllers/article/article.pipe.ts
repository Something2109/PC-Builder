import { Products, Topics } from "@/utils/Enum";
import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from "@nestjs/common";

@Injectable()
export class TopicPipe implements PipeTransform<string, Topics> {
  transform(value: string, metadata: ArgumentMetadata): Topics {
    if (Object.values(Topics).includes(value as Topics)) {
      return value as Topics;
    }

    throw new NotFoundException(
      `Cannot find the topic ${value}. Check if the path is correct`
    );
  }
}

@Injectable()
export class ProductPipe implements PipeTransform<string, Products> {
  transform(value: string, metadata: ArgumentMetadata): Products {
    if (Object.values(Products).includes(value as Products)) {
      return value as Products;
    }

    throw new NotFoundException(
      `Cannot find the product ${value}. Check if the path is correct`
    );
  }
}
