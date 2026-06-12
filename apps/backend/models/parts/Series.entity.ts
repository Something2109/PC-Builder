import {
  Column,
  DataType,
  BelongsTo,
  HasMany,
  ForeignKey,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
} from "sequelize-typescript";

import BrandModel from "./Brand.entity";
import PartInformation from "./PartInformation.entity";

@Table({
  modelName: "series",
  tableName: "series",
  timestamps: false,
})
export default class SeriesModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @ForeignKey(() => BrandModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "brand_id",
  })
  declare brandId: number;

  @BelongsTo(() => BrandModel)
  declare brand: BrandModel;

  @HasMany(() => PartInformation)
  declare parts: PartInformation[];
}
