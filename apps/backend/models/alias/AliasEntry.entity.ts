import { Column, DataType, Model, PrimaryKey, AutoIncrement, Table } from "sequelize-typescript";

import { Tables } from "../interface";

@Table({
  tableName: Tables.ALIAS_ENTRY,
  timestamps: true,
  indexes: [
    {
      name: "unique_alias_entry",
      unique: true,
      fields: ["product", "info", "attribute", "alias"],
    },
    {
      name: "alias_lookup",
      fields: ["product", "alias"],
    },
    {
      name: "forward_lookup",
      fields: ["product", "info"],
    },
  ],
})
export default class AliasEntry extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column(DataType.STRING(50))
  declare product: string;

  @Column(DataType.STRING(50))
  declare info: string;

  @Column(DataType.STRING(50))
  declare attribute: string;

  @Column(DataType.STRING(100))
  declare alias: string;

  @Column(DataType.ENUM("seed", "learned", "manual"))
  declare source: "seed" | "learned" | "manual";

  @Column(DataType.INTEGER)
  declare frequency: number;

  @Column(DataType.FLOAT)
  declare confidence: number;
}
