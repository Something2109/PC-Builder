import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
} from "sequelize-typescript";

import { Tables } from "../interface";

@Table({
  tableName: Tables.ALIAS_LEARNER_LOG,
  timestamps: true,
})
export default class AliasLearnerLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column(DataType.STRING)
  declare product: string;

  @Column(DataType.STRING)
  declare info: string;

  @Column(DataType.STRING)
  declare attribute: string;

  @Column(DataType.STRING)
  declare raw_key: string;

  @Column(DataType.STRING)
  declare normalized_key: string;

  @Column(DataType.STRING)
  declare match_type: string;

  @Column(DataType.FLOAT)
  declare match_score: number;

  @Column(DataType.ENUM("auto", "approved", "rejected"))
  declare status: "auto" | "approved" | "rejected";
}
