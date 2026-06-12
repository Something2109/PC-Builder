import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

import * as API from "@/utils/API";
import { ArticleStatus } from "@/utils/article";
import { Products } from "@/utils/part";

export type ArticleFilter = {
  part?: Products;
  topic?: string;
  status?: ArticleStatus;
};

export class QueryFilterPipe implements PipeTransform {
  transform(
    value: Record<string, string | string[]>,
    _metadata: ArgumentMetadata
  ): ArticleFilter & API.PageOptions {
    const criteria: ArticleFilter = {};

    const topic = typeof value["topic"] === "string" ? value["topic"] : null;
    if (topic) criteria.topic = topic;

    const status = this.check(value["status"], Object.values(ArticleStatus));
    if (status) criteria.status = status;

    const part = this.check(value["part"], Object.values(Products));
    if (part) criteria.part = part;

    const pageOptions = API.toPageOptions(value);

    return { ...criteria, ...pageOptions };
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
