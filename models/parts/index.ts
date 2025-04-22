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
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
} from "sequelize-typescript";
import { Includeable } from "sequelize";
import { CaseSpecModel } from "./info/CaseSpec";
import { CaseFanSupportModel } from "./info/CaseFanSupport";
import { CaseRadiatorSupportModel } from "./info/CaseRadiatorSupport";
import { CaseHardDriveSupportModel } from "./info/CaseHardDriveSupport";
import { CaseMainboardSupportModel } from "./info/CaseMainboardSupport";
import { CasePSUSupportModel } from "./info/CasePSUSupport";
import { FanSpecModel } from "./info/FanSpec";
import { CPUSpecModel } from "./info/CPUSpec";
import { CPUPerformanceModel } from "./info/CPUPerformance";
import { CPUCoreConfigModel } from "./info/CPUCoreConfig";
import { GPUSpecModel } from "./info/GPUSpec";
import { GPUPerformanceModel } from "./info/GPUPerformance";
import { GPUFeatureModel } from "./info/GPUFeature";
import { ProcessorCacheModel } from "./info/ProcessorCache";
import { ProcessorMemoryModel } from "./info/ProcessorMemorySpec";
import { GraphicCardSpecModel } from "./info/GraphicCardSpec";
import { MainboardSpecModel } from "./info/MainboardSpec";
import { MainboardPCIeModel } from "./info/MainboardPCIe";
import { MainboardStorageConnectorModel } from "./info/MainboardStorageConnector";
import { MainboardUSBConnectorModel } from "./info/MainboardUSBConnector";
import { RAMSpecModel } from "./info/RAMSpec";
import { SSDSpecModel } from "./info/SSDSpec";
import { HDDSpecModel } from "./info/HDDSpec";
import { StoragePerformanceModel } from "./info/StoragePerformance";
import { StorageCacheModel } from "./info/StorageCache";
import { PSUSpecModel } from "./info/PSUSpec";
import { CPUBlockSpecModel } from "./info/CPUBlockSpec";
import { PumpSpecModel } from "./info/PumpSpec";
import { RadiatorSpecModel } from "./info/RadiatorSpec";
import { CPUBlockSocketModel } from "./info/CPUBlockSocketSupport";

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

  @HasOne(() => CPUSpecModel)
  declare [Infos.CPU_SPEC]: CPUSpecModel | null;

  @HasOne(() => CPUPerformanceModel)
  declare [Infos.CPU_PERF]: CPUPerformanceModel | null;

  @HasMany(() => CPUCoreConfigModel)
  declare [Infos.CPU_CORES]: CPUCoreConfigModel[];

  @HasOne(() => GPUSpecModel)
  declare [Infos.GPU_SPEC]: GPUSpecModel | null;

  @HasOne(() => GPUPerformanceModel)
  declare [Infos.GPU_PERF]: GPUPerformanceModel | null;

  @HasOne(() => GPUFeatureModel)
  declare [Infos.GPU_FEAT]: GPUFeatureModel | null;

  @HasOne(() => ProcessorCacheModel)
  declare [Infos.PROCESSOR_CACHE]: ProcessorCacheModel | null;

  @HasOne(() => ProcessorMemoryModel)
  declare [Infos.PROCESSOR_MEMORY]: ProcessorMemoryModel | null;

  @HasOne(() => GraphicCardSpecModel)
  declare [Infos.GRAPHIC_CARD_SPEC]: GraphicCardSpecModel | null;

  @HasOne(() => MainboardSpecModel)
  declare [Infos.MAIN_SPEC]: MainboardSpecModel | null;

  @HasMany(() => MainboardPCIeModel)
  declare [Infos.MAIN_PCIE]: MainboardPCIeModel[];

  @HasMany(() => MainboardStorageConnectorModel)
  declare [Infos.MAIN_STORAGE]: MainboardStorageConnectorModel[];

  @HasMany(() => MainboardUSBConnectorModel)
  declare [Infos.MAIN_USB]: MainboardUSBConnectorModel[];

  @HasOne(() => RAMSpecModel)
  declare [Infos.RAM_SPEC]: RAMSpecModel | null;

  @HasOne(() => SSDSpecModel)
  declare [Infos.SSD_SPEC]: SSDSpecModel | null;

  @HasOne(() => HDDSpecModel)
  declare [Infos.HDD_SPEC]: HDDSpecModel | null;

  @HasOne(() => StoragePerformanceModel)
  declare [Infos.STORAGE_PERF]: StoragePerformanceModel | null;

  @HasOne(() => StorageCacheModel)
  declare [Infos.STORAGE_CACHE]: StorageCacheModel | null;

  @HasOne(() => PSUSpecModel)
  declare [Infos.PSU_SPEC]: PSUSpecModel | null;

  @HasOne(() => CaseSpecModel)
  declare [Infos.CASE_SPEC]: CaseSpecModel | null;

  @HasMany(() => CaseFanSupportModel)
  declare [Infos.CASE_FAN]: CaseFanSupportModel[];

  @HasMany(() => CaseMainboardSupportModel)
  declare [Infos.CASE_MAIN]: CaseMainboardSupportModel[];

  @HasMany(() => CaseHardDriveSupportModel)
  declare [Infos.CASE_HARD_DRIVE]: CaseHardDriveSupportModel[];

  @HasMany(() => CaseRadiatorSupportModel)
  declare [Infos.CASE_RADIATOR]: CaseRadiatorSupportModel[];

  @HasMany(() => CasePSUSupportModel)
  declare [Infos.CASE_PSU]: CasePSUSupportModel[];

  @HasOne(() => FanSpecModel)
  declare [Infos.FAN_SPEC]: FanSpecModel | null;

  @HasOne(() => CPUBlockSpecModel)
  declare [Infos.CPU_BLOCK_SPEC]: CPUBlockSpecModel;

  @HasMany(() => CPUBlockSocketModel)
  declare [Infos.CPU_BLOCK_SOCKET]: CPUBlockSocketModel[];

  @HasOne(() => PumpSpecModel)
  declare [Infos.PUMP_SPEC]: PumpSpecModel;

  @HasOne(() => RadiatorSpecModel)
  declare [Infos.RADIATOR_SPEC]: RadiatorSpecModel;
}

export { PartInformation };
