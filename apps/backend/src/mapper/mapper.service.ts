import { Injectable } from "@nestjs/common";
import { RawPartMapper, Products } from "@pc-builder/shared/part";

import { DbAliasLearner } from "../alias/db-alias-learner.service";
import { DbAliasRegistry } from "../alias/db-alias-registry.service";

@Injectable()
export class MapperService {
  constructor(
    private registry: DbAliasRegistry,
    private learner: DbAliasLearner
  ) {}

  async mapRawPart(
    raw: Record<string, any>,
    product: Products,
    fallbackBrand?: string
  ): Promise<any> {
    return RawPartMapper.map(raw, product, this.registry, this.learner, fallbackBrand);
  }

  async safeMapRawPart(
    raw: Record<string, any>,
    product: Products,
    fallbackBrand?: string
  ): Promise<any> {
    return RawPartMapper.safeMap(raw, product, this.registry, this.learner, fallbackBrand);
  }
}
