import { InternalConnectors } from "@pc-builder/shared/interface";
import { Infos } from "@pc-builder/shared/part";
import * as GraphicCardSpec from "@pc-builder/shared/part/info/GraphicCardSpec";
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

@Scopes(() => ({
  [ModelScopes.SUMMARY]: (attributes?: string[]) => ({
    attributes: attributes?.length ? ["id", ...attributes] : [],
  }),
  [ModelScopes.FILTER]: (options?: Record<string, string[] | number[]>) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({
  modelName: Infos.GRAPHIC_CARD_SPEC,
  indexes: [
    {
      name: "gc_spec_min_psu_idx",
      fields: ["minimum_psu"],
    },
  ],
})
export default class GraphicCardSpecModel extends Model implements GraphicCardSpec.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.FLOAT)
  declare width: number | null;

  @Column(DataType.FLOAT)
  declare length: number | null;

  @Column(DataType.FLOAT)
  declare height: number | null;

  @Column(DataType.INTEGER)
  declare pcie: number | null;

  @Column(DataType.INTEGER)
  declare minimum_psu: number | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.Power.GraphicCard.options] },
  })
  declare power_connector: InternalConnectors.Power.GraphicCard | null;

  @Column(DataType.TINYINT)
  declare power_connector_count: number | null;
}
