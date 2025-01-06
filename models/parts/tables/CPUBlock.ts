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
import CPUBlock from "@/utils/interface/part/CPUBlock";
import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
} from "../../interface";
import { PartInformation } from "./Part";
import { InternalConnectors } from "@/utils/interface/utils";

@Scopes(() => ({
  [ModelScopes.SUMMARY]: { attributes: ["id", ...CPUBlock.SummaryAttributes] },
  [ModelScopes.FILTER]: (options: CPUBlock.FilterOptions) => {
    const { socket, ...rest } = options ?? {};

    return {
      where: rest,
      include: {
        model: CPUBlockSocketModel,
        where: socket ? { socket } : {},
        required: Boolean(socket),
      },
    };
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
    const data = this.getDataValue("socket_data");
    this.setDataValue("socket_data", undefined);

    if (!data) return undefined;

    return data.map((value: CPUBlockSocketModel) => value.socket);
  }

  @Column({
    type: DataType.STRING,
    validate: { isIn: [CPUBlock.Plate.options] },
  })
  declare plate: CPUBlock.Plate | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.RGB.options] },
  })
  declare rgb: InternalConnectors.RGB | null;
}

@Table({ modelName: Tables.CPU_BLOCK_SOCKET })
class CPUBlockSocketModel extends Model {
  @PrimaryKey
  @ForeignKey(() => CPUBlockModel)
  @Column(DataType.UUID)
  declare id: string;

  @PrimaryKey
  @Column(DataType.STRING)
  declare socket: string;
}

export { CPUBlockModel, CPUBlockSocketModel };
