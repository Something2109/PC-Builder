import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from "sequelize-typescript";
import { FindOptions, IncludeOptions, SaveOptions } from "sequelize";
import CPUBlock from "@/utils/interface/part/CPUBlock";
import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
  defaultFilter,
} from "../../interface";
import { InternalConnectors } from "@/utils/interface/utils";
import { Material } from "@/utils/interface/utils";
import { PartInformation } from "./Part";

function createFilterOptions(options?: CPUBlock.FilterOptions): FindOptions {
  const { socket, ...where } = options ?? {};

  const include = [];
  if (socket) {
    include.push({
      model: CPUBlockSocketModel,
      where: { socket },
      required: Boolean(socket),
    });
  }

  return { where: defaultFilter(where), include };
}

@Scopes(() => ({
  [ModelScopes.SUMMARY]: (options: CPUBlock.FilterOptions) => ({
    attributes: ["id", ...CPUBlock.SummaryAttributes],
    ...createFilterOptions(options),
  }),
  [ModelScopes.FILTER]: (options: CPUBlock.FilterOptions) => {
    const { where, include } = createFilterOptions(options);

    (include as IncludeOptions[]).forEach((model) => (model.attributes = []));

    return { where, include };
  },
  [ModelScopes.DETAIL]: {
    ...PartDefaultScope,
    include: CPUBlockSocketModel,
  },
}))
@Table({ modelName: Tables.CPU_BLOCK })
class CPUBlockModel extends Model implements PartDetailTable<CPUBlock.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @HasMany(() => CPUBlockSocketModel)
  declare socket_data: CPUBlockSocketModel[];

  @Column(DataType.VIRTUAL)
  get socket(): string[] | undefined {
    const data: CPUBlockSocketModel[] | undefined =
      this.getDataValue("socket_data");

    if (!data) return undefined;

    this.setDataValue("socket_data", undefined);
    return data.map((value) => value.socket);
  }

  set socket(data: string[] | null) {
    const current: CPUBlockSocketModel[] | undefined =
      this.getDataValue("socket_data");

    if (data === null && current) current.map((value) => value.destroy());

    if (!data) return;

    const newData = this.socketResolver(data, current ?? []);

    this.socket_data = newData;
    this.setDataValue("socket_data", newData);
  }

  private socketResolver(
    data: string[],
    current: CPUBlockSocketModel[]
  ): CPUBlockSocketModel[] {
    const newData = current.reduce((acc, val) => {
      acc[val.socket] = val;
      return acc;
    }, {} as { [key in string]: CPUBlockSocketModel });

    data.forEach((socket) => {
      if (!newData[socket]) {
        newData[socket] = CPUBlockSocketModel.build({
          id: this.id,
          socket,
        });
      }
    });

    Object.keys(newData)
      .filter((value) => !data.includes(value))
      .forEach((value) => {
        newData[value]?.destroy();
        delete newData[value];
      });

    return Object.values(newData);
  }

  @Column({
    type: DataType.STRING,
    validate: { isIn: [Material.Metal.options] },
  })
  declare plate: Material.Metal | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.RGB.options] },
  })
  declare rgb: InternalConnectors.RGB | null;

  async save(options?: SaveOptions<any> | undefined): Promise<this> {
    const result = await super.save(options);

    await Promise.all(this.socket_data?.map((socket) => socket.save(options)));

    return result;
  }
}

@Table({ modelName: Tables.CPU_BLOCK_SOCKET })
class CPUBlockSocketModel extends Model {
  @PrimaryKey
  @ForeignKey(() => CPUBlockModel)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => CPUBlockModel)
  declare cpu_block: CPUBlockModel;

  @PrimaryKey
  @Column(DataType.STRING)
  declare socket: string;
}

export { CPUBlockModel, CPUBlockSocketModel };
