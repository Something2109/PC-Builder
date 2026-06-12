import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
} from "sequelize-typescript";

import PartInformation from "./PartInformation.entity";
import SeriesModel from "./Series.entity";

@Table({
  modelName: "brand",
  tableName: "brands",
  timestamps: false,
})
export default class BrandModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column(DataType.STRING)
  declare logo_url: string | null;

  @HasMany(() => PartInformation)
  declare parts: PartInformation[];

  @HasMany(() => SeriesModel)
  declare series: SeriesModel[];
}
