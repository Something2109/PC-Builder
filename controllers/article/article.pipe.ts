import { Products, Topics } from "@/utils/Enum";
import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export type ArticleFilter = {
  part?: Products;
  topic?: Topics;
};

export class QueryFilterPipe implements PipeTransform {
  transform(
    value: Record<string, string | string[]>,
    metadata: ArgumentMetadata
  ): ArticleFilter {
    const criteria: ArticleFilter = {};

    const topic = this.check(value["topic"], Object.values(Topics));
    if (topic) criteria.topic = topic;

    const part = this.check(value["part"], Object.values(Products));
    if (part) criteria.part = part;

    return criteria;
  }

  private check<T>(value: string | string[], list: T[]): T | null {
    if (!value) return null;

    const arr = [value].flat(1);

    for (let i = 0; i < arr.length; i++) {
      if (list.includes(arr[i] as T)) return arr[i] as T;
    }

    return null;
  }
}
