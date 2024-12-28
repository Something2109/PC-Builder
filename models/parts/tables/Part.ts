import { Tables } from "@/models/interface";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import {
  Column,
  DataType,
  Default,
  DefaultScope,
  HasOne,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
} from "sequelize-typescript";
import { CPUModel } from "./CPU";
import { GPUModel } from "./GPU";
import { GraphicCardModel } from "./GraphicCard";
import { MainboardModel } from "./Mainboard";
import { RAMModel } from "./RAM";
import { SSDModel } from "./SSD";
import { HDDModel } from "./HDD";
import { PSUModel } from "./PSU";
import { CaseModel } from "./Case";
import { CoolerModel } from "./Cooler";
import { AIOModel } from "./AIO";
import { FanModel } from "./Fan";

@DefaultScope(() => ({
  attributes: {
    exclude: ["raw", "createdAt", "updatedAt"],
  },
}))
@Scopes(() => ({
  summary: { attributes: [...Part.SummaryAttributes] },
  filter: (options: Part.FilterOptions) => ({ where: options }),
  detail: { attributes: { exclude: ["createdAt", "updatedAt"] } },
}))
@Table({ modelName: Tables.PART })
class PartInformation extends Model implements Part.BasicInfo {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [Object.values(Products)] },
  })
  declare part: Products;

  @Column({ type: DataType.STRING })
  declare name: string;

  @Unique
  @Column(DataType.STRING)
  declare code_name: string;

  @Column(DataType.STRING)
  declare brand: string;

  @Column(DataType.STRING)
  declare series: string;

  @Column(DataType.DATE)
  declare launch_date?: Date;

  @Column({ type: DataType.STRING, validate: { isUrl: true } })
  declare url?: string;

  @Column({ type: DataType.STRING, validate: { isUrl: true } })
  declare image_url?: string;

  @Column({ type: DataType.TEXT })
  declare raw?: string;

  @HasOne(() => CPUModel)
  declare [Products.CPU]: CPUModel;

  @HasOne(() => GPUModel)
  declare [Products.GPU]: GPUModel;

  @HasOne(() => GraphicCardModel)
  declare [Products.GRAPHIC_CARD]: GraphicCardModel;

  @HasOne(() => MainboardModel)
  declare [Products.MAIN]: MainboardModel;

  @HasOne(() => RAMModel)
  declare [Products.RAM]: RAMModel;

  @HasOne(() => SSDModel)
  declare [Products.SSD]: SSDModel;

  @HasOne(() => HDDModel)
  declare [Products.HDD]: HDDModel;

  @HasOne(() => PSUModel)
  declare [Products.PSU]: PSUModel;

  @HasOne(() => CaseModel)
  declare [Products.CASE]: CaseModel;

  @HasOne(() => CoolerModel)
  declare [Products.COOLER]: CoolerModel;

  @HasOne(() => AIOModel)
  declare [Products.AIO]: AIOModel;

  @HasOne(() => FanModel)
  declare [Products.FAN]: FanModel;
}

export { PartInformation };
