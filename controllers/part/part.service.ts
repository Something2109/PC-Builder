import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import {
  CRUD_INTERFACE,
  LIST_INTERFACE,
  DatabaseCRUDInterface,
  DatabaseListInterface,
  FilterAttributeMapping,
} from "./interface/database.service";
import Part, { Mapping } from "@/utils/interface/part";
import { API } from "@/utils/interface/api";
import { Infos, Products } from "@/utils/Enum";

@Injectable()
class PartService {
  private readonly logger: Logger = new Logger(PartService.name);

  constructor(
    @Inject(LIST_INTERFACE)
    private readonly ListService: DatabaseListInterface,
    @Inject(CRUD_INTERFACE)
    private readonly CRUDService: DatabaseCRUDInterface
  ) {}

  async list(options: Part.Filter & API.PageOptions, product?: Products) {
    if (product) options.part = { ...options.part, part: [product] };

    const infoMapping = product
      ? Mapping.Info[product].reduce((acc, info) => {
          acc[info] = Mapping.SummaryAttributeMapping[product][info] ?? [];
          return acc;
        }, {} as { [key in Infos]?: string[] })
      : undefined;

    return await this.ListService.list(options, infoMapping);
  }

  async filter(
    options: Part.Filter & API.PageOptions,
    product?: Products,
    ...attributes: string[]
  ) {
    if (product) options.part = { ...options.part, part: [product] };

    const infoMapping: FilterAttributeMapping = {
      part:
        attributes.length === 0
          ? Part.BasicFilterAttributes
          : Part.BasicFilterAttributes.filter((attr) =>
              attributes.includes(attr)
            ),
    };

    if (product) {
      const entries =
        attributes.length === 0
          ? Object.values(Mapping.AttributeMapping[product])
          : attributes.map((attr) => Mapping.AttributeMapping[product][attr]);

      entries.forEach((entry) => {
        if (!entry) return;
        const [info, attr] = entry as [Infos, string];

        if (!infoMapping[info]) infoMapping[info] = [];
        infoMapping[info].push(attr);
      });

      Mapping.Info[product].forEach((info) => {
        if (!infoMapping[info]) infoMapping[info] = [];
      });
    }

    return await this.ListService.filter(options, infoMapping);
  }

  async create(product: Products, data: Part.Detail) {
    try {
      const instance = await this.CRUDService.create(
        data,
        product ? Mapping.Info[product] : undefined
      );

      if (!instance) return null;

      return instance;
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }

  async get(id: string, product?: Products) {
    const data = await this.CRUDService.get(
      id,
      product ? Mapping.Info[product] : undefined
    );

    if (!data) return null;

    if (product && data.part !== product) return null;

    return data;
  }

  async set(id: string, product: Products, data: Part.Detail) {
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
