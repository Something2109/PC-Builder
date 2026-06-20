import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";

import Part, { Products, Mapping } from "@pc-builder/shared/part";

import {
  CRUD_INTERFACE,
  LIST_INTERFACE,
  DatabaseCRUDInterface,
  DatabaseListInterface,
} from "./interface/database.interface";
import {
  PARSE_INTERFACE,
  ParseServiceInterface,
  PartServiceInterface,
} from "./interface/part.interface";

@Injectable()
class PartService implements PartServiceInterface {
  private readonly logger: Logger = new Logger(PartService.name);

  constructor(
    @Inject(PARSE_INTERFACE)
    private readonly parseService: ParseServiceInterface,
    @Inject(LIST_INTERFACE)
    private readonly ListService: DatabaseListInterface,
    @Inject(CRUD_INTERFACE)
    private readonly CRUDService: DatabaseCRUDInterface
  ) {}

  async list(params: Record<string, string | string[]>, product?: Products) {
    const options = this.parseService.options(params, product);

    const infoMapping = product ? Mapping.SummaryAttributeMapping[product] : undefined;

    const { list, total } = await this.ListService.list(options, infoMapping);

    return {
      list: list.map((part) => this.parseService.summary(part, product)),
      total,
    };
  }

  async filter(
    params: Record<string, string | string[]>,
    product?: Products,
    ...attributes: string[]
  ) {
    const options = this.parseService.options(params, product);
    const infoMapping = this.parseService.attributes(attributes, product);

    if (product) options.part = { ...options.part, part: [product] };

    const result = await this.ListService.filter(options, infoMapping);

    return this.parseService.filter(result, product, ...attributes);
  }

  async create(product: Products, data: Part.DTO) {
    try {
      const instance = await this.CRUDService.create(
        { ...data, part: product },
        product ? Mapping.Info[product] : undefined
      );

      if (!instance) return null;

      return instance;
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }

  async get(id: string, product?: Products) {
    const data = await this.CRUDService.get(id, product ? Mapping.Info[product] : undefined);

    if (!data) return null;

    if (product && data.part !== product) return null;

    return data;
  }

  async set(id: string, product: Products, data: Part.DTO) {
    try {
      const instance = await this.CRUDService.get(id);

      if (instance && instance.part !== product) return null;

      const newData = await this.CRUDService.set(
        id,
        data,
        product ? Mapping.Info[product] : undefined
      );

      if (!newData) return null;

      return newData;
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }

  async delete(id: string, product: Products) {
    const instance = await this.CRUDService.get(id);

    if (instance && instance.part !== product) return null;

    const data = await this.CRUDService.delete(id);

    return data;
  }
}

export { PartService };
