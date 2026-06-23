import { FormFactor, InternalConnectors } from "@pc-builder/shared/interface";
import { Infos } from "@pc-builder/shared/part";
import * as HDDSpec from "@pc-builder/shared/part/info/HDDSpec";
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
  modelName: Infos.HDD_SPEC,
  indexes: [
    {
      name: "hdd_spec_capacity_idx",
      fields: ["capacity"],
    },
    {
      name: "hdd_spec_interface_idx",
      fields: ["interface"],
    },
    {
      name: "hdd_spec_rpm_idx",
      fields: ["rotational_speed"],
    },
  ],
})
export default class HDDSpecModel extends Model implements HDDSpec.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.INTEGER)
  declare rotational_speed: number | null;

  @Column(DataType.TINYINT)
  declare capacity: number | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.HDD.options] },
  })
  declare form_factor: FormFactor.HDD | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.Storage.HDD.options] },
  })
  declare interface: InternalConnectors.Storage.HDD | null;
}
