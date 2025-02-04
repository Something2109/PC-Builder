import {
  ModelScopes,
  PartDefaultScope,
  Tables,
  defaultFilter,
} from "@/models/interface";
import Part from "@/utils/interface/info/Parts";
import { Products, Info } from "@/utils/Enum";
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
import { CPUBlockModel } from "./CPUBlock";
import { PumpModel } from "./Pump";
import { RadiatorModel } from "./Radiator";
import { Includeable } from "sequelize";

@DefaultScope(() => PartDefaultScope)
@Scopes(() => ({
  [ModelScopes.SUMMARY]: (
    options: Part.FilterOptions,
    ...include: Includeable[]
  ) => ({
    attributes: ["id", ...Part.SummaryAttributes],
    where: defaultFilter(options),
    include,
  }),
  [ModelScopes.FILTER]: (
    options: Part.FilterOptions,
    ...include: Includeable[]
  ) => ({ where: defaultFilter(options), include }),
  [ModelScopes.DETAIL]: { attributes: { exclude: ["createdAt", "updatedAt"] } },
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
  declare [Info.CPU]: CPUModel;

  @HasOne(() => GPUModel)
  declare [Info.GPU]: GPUModel;

  @HasOne(() => GraphicCardModel)
  declare [Info.GRAPHIC_CARD]: GraphicCardModel;

  @HasOne(() => MainboardModel)
  declare [Info.MAIN]: MainboardModel;

  @HasOne(() => RAMModel)
  declare [Info.RAM]: RAMModel;

  @HasOne(() => SSDModel)
  declare [Info.SSD]: SSDModel;

  @HasOne(() => HDDModel)
  declare [Info.HDD]: HDDModel;

  @HasOne(() => PSUModel)
  declare [Info.PSU]: PSUModel;

  @HasOne(() => CaseModel)
  declare [Info.CASE]: CaseModel;

  @HasOne(() => CoolerModel)
  declare [Info.COOLER]: CoolerModel;

  @HasOne(() => AIOModel)
  declare [Info.AIO]: AIOModel;

  @HasOne(() => FanModel)
  declare [Info.FAN]: FanModel;

  @HasOne(() => CPUBlockModel)
  declare [Info.CPU_BLOCK]: CPUBlockModel;

  @HasOne(() => PumpModel)
  declare [Info.PUMP]: PumpModel;

  @HasOne(() => RadiatorModel)
  declare [Info.RADIATOR]: RadiatorModel;
}

export { PartInformation };
