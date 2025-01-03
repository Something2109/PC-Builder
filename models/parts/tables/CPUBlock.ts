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
  [ModelScopes.FILTER]: (options: CPUBlock.FilterOptions) => ({
    where: options,
  }),
  [ModelScopes.DETAIL]: {
    ...PartDefaultScope,
    include: { model: CPUBlockSocketModel, attributes: ["socket"] },
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
  get socket(): string[] {
    const data = this.getDataValue("socket_data") as CPUBlockSocketModel[];

    return data.map((value) => value.socket);
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
