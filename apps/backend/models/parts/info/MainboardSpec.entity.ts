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

import { InternalConnectors, FormFactor } from "@pc-builder/shared/interface";
import { Infos } from "@pc-builder/shared/part";
import * as MainboardSpec from "@pc-builder/shared/part/info/MainboardSpec";

import { PartInformation } from "..";
import { PartDefaultScope, ModelScopes, defaultFilter } from "../../interface";

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
@Table({
  modelName: Infos.MAIN_SPEC,
  indexes: [
    {
      name: "mb_spec_socket_idx",
      fields: ["socket"],
    },
    {
      name: "mb_spec_form_idx",
      fields: ["form_factor"],
    },
    {
      name: "mb_spec_ram_form_idx",
      fields: ["ram_form_factor"],
    },
    {
      name: "mb_spec_ram_interface_idx",
      fields: ["ram_interface"],
    },
  ],
})
export default class MainboardSpecModel extends Model implements MainboardSpec.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Mainboard.options] },
  })
  declare form_factor: FormFactor.Mainboard | null;

  @Column(DataType.STRING)
  declare socket: string | null;

  @Column(DataType.STRING)
  declare chipset: string | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.RAM.options] },
  })
  declare ram_form_factor: FormFactor.RAM | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.RAM.options] },
  })
  declare ram_interface: InternalConnectors.RAM | null;

  @Column(DataType.TINYINT)
  declare ram_slot: number | null;
}
