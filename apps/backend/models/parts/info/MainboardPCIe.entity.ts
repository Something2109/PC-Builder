import { InternalConnectors } from "@pc-builder/shared/interface";
import { Infos } from "@pc-builder/shared/part";
import * as MainboardPCIe from "@pc-builder/shared/part/info/MainboardPCIe";
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
@Table({ modelName: Infos.MAIN_PCIE })
export default class MainboardPCIeModel extends Model implements MainboardPCIe.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.PCIe.Controller.options] },
  })
  declare controller: InternalConnectors.PCIe.Controller;

  @PrimaryKey
  @Column(DataType.TINYINT)
  declare version: number;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.PCIe.Width.options] },
  })
  declare width: InternalConnectors.PCIe.Width;

  @Column(DataType.TINYINT)
  declare count: number | null;
}
