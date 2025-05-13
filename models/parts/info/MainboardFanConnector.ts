import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from "sequelize-typescript";
import MainboardFanConnector from "@/utils/interface/part/info/MainboardFanConnector";
import { InternalConnectors } from "@/utils/interface/utils";
import { Infos } from "@/utils/Enum";
import { PartInformation } from "..";
import { PartDefaultScope, ModelScopes, defaultFilter } from "../../interface";

/**
 * Declare the PCIe model to store the mainboard's PCIe data.
 * The model is used for future search and filter operations.
 */
@Scopes(() => ({
  [ModelScopes.SUMMARY]: (attributes?: string[]) => ({
    attributes: attributes?.length ? ["id", ...attributes] : [],
  }),
  [ModelScopes.FILTER]: (options?: Record<string, string[] | number[]>) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: {
    ...PartDefaultScope,
  },
}))
@Table({ modelName: Infos.MAIN_FAN })
class MainboardFanConnectorModel
  extends Model
  implements MainboardFanConnector.Info
{
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.Fan.Type.options] },
  })
  declare type: InternalConnectors.Fan.Type;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.Fan.Connector.options] },
  })
  declare connector: InternalConnectors.Fan.Connector;

  @Column(DataType.TINYINT)
  declare count: number;
}

export { MainboardFanConnectorModel };
