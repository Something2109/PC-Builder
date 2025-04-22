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
import MainboardStorageConnector from "@/utils/interface/part/info/MainboardStorageConnector";
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
@Table({ modelName: Infos.MAIN_STORAGE })
class MainboardStorageConnectorModel
  extends Model
  implements MainboardStorageConnector.Info
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
    validate: {
      isIn: [
        [
          ...InternalConnectors.Storage.HDD.options,
          ...InternalConnectors.Storage.SSD.options,
        ],
      ],
    },
  })
  declare form_factor: InternalConnectors.Storage;

  @Column(DataType.TINYINT)
  declare count: number;
}

export { MainboardStorageConnectorModel };
