import {
  ModelScopes,
  PartDefaultScope,
  Tables,
  defaultFilter,
} from "@/models/interface";
import Part from "@/utils/interface/part";
import { Products, Infos } from "@/utils/Enum";
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
import { CPUModel } from "./tables/CPU";
import { GPUModel } from "./tables/GPU";
import { GraphicCardModel } from "./tables/GraphicCard";
import { MainboardModel } from "./tables/Mainboard";
import { RAMModel } from "./tables/RAM";
import { SSDModel } from "./tables/SSD";
import { HDDModel } from "./tables/HDD";
import { PSUModel } from "./tables/PSU";
import { CaseModel } from "./tables/Case";
import { CoolerModel } from "./tables/Cooler";
import { AIOModel } from "./tables/AIO";
import { FanModel } from "./tables/Fan";
import { CPUBlockModel } from "./tables/CPUBlock";
import { PumpModel } from "./tables/Pump";
import { RadiatorModel } from "./tables/Radiator";
import { Includeable } from "sequelize";

type InfoModelMapping = {
  [key in Infos]: Model | Model[] | null;
};

@DefaultScope(() => PartDefaultScope)
@Scopes(() => ({
  [ModelScopes.SUMMARY]: (attributes?: string[]) => ({
    attributes: attributes?.length ? ["id", ...attributes] : [],
  }),
  [ModelScopes.FILTER]: (
    options: Part.Filter["part"],
    ...include: Includeable[]
  ) => ({
    where: defaultFilter(options),
    include,
  }),
  [ModelScopes.DETAIL]: { attributes: { exclude: ["createdAt", "updatedAt"] } },
}))
@Table({ modelName: Tables.PART })
class PartInformation
  extends Model
  implements Part.BasicInfo, InfoModelMapping
{
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
  declare [Infos.CPU]: CPUModel;

  @HasOne(() => GPUModel)
  declare [Infos.GPU]: GPUModel;

  @HasOne(() => GraphicCardModel)
  declare [Infos.GRAPHIC_CARD]: GraphicCardModel;

  @HasOne(() => MainboardModel)
  declare [Infos.MAIN]: MainboardModel;

  @HasOne(() => RAMModel)
  declare [Infos.RAM]: RAMModel;

  @HasOne(() => SSDModel)
  declare [Infos.SSD]: SSDModel;

  @HasOne(() => HDDModel)
  declare [Infos.HDD]: HDDModel;

  @HasOne(() => PSUModel)
  declare [Infos.PSU]: PSUModel;

  @HasOne(() => CaseModel)
  declare [Infos.CASE]: CaseModel;

  @HasOne(() => CoolerModel)
  declare [Infos.COOLER]: CoolerModel;

  @HasOne(() => AIOModel)
  declare [Infos.AIO]: AIOModel;

  @HasOne(() => FanModel)
  declare [Infos.FAN]: FanModel;

  @HasOne(() => CPUBlockModel)
  declare [Infos.CPU_BLOCK]: CPUBlockModel;

  @HasOne(() => PumpModel)
  declare [Infos.PUMP]: PumpModel;

  @HasOne(() => RadiatorModel)
  declare [Infos.RADIATOR]: RadiatorModel;
}

export { PartInformation };
