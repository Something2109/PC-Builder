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

import { InternalConnectors } from "@/utils/interface";
import { Infos } from "@/utils/part";
import * as MainboardStorageConnector from "@/utils/part/info/MainboardStorageConnector";

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
export default class MainboardStorageConnectorModel extends Model
  implements MainboardStorageConnector.Model
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
      isIn: [InternalConnectors.Storage.Options],
    },
  })
  declare form_factor: InternalConnectors.Storage;

  @Column(DataType.TINYINT)
  declare count: number | null;
}



