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

import { ExternalPorts } from "@/utils/interface";
import { Infos } from "@/utils/part";
import * as GraphicCardPort from "@/utils/part/info/GraphicCardPort";

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
@Table({ modelName: Infos.GRAPHIC_CARD_PORT })
export default class GraphicCardPortModel extends Model implements GraphicCardPort.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [ExternalPorts.Display.Type.options] },
  })
  declare type: ExternalPorts.Display.Type;

  @PrimaryKey
  @Column(DataType.STRING)
  declare name: ExternalPorts.Display;

  @Column(DataType.TINYINT)
  declare count: number | null;
}
