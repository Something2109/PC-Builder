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
import MainboardUSBConnector from "@/utils/interface/part/info/MainboardUSBConnector";
import { ExternalPorts } from "@/utils/interface/utils";
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
@Table({ modelName: Infos.MAIN_USB })
class MainboardUSBConnectorModel
  extends Model
  implements MainboardUSBConnector.Info
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
    validate: { isIn: [ExternalPorts.Peripheral.USB.Generation.options] },
  })
  declare generation: ExternalPorts.Peripheral.USB.Generation;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [ExternalPorts.Peripheral.USB.Connector.options] },
  })
  declare connector: ExternalPorts.Peripheral.USB.Connector;

  @Column(DataType.TINYINT)
  declare count: number;
}

export { MainboardUSBConnectorModel };
