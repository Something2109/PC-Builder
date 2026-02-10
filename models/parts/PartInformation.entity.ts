import {
  ModelScopes,
  PartDefaultScope,
  Tables,
  defaultFilter,
} from "@/models/interface";
import Part, { Products, Infos } from "@/utils/part";
import {
  AllowNull,
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
import CaseSpecModel from "./info/CaseSpec.entity";
import CaseFanSupportModel from "./info/CaseFanSupport.entity";
import CaseRadiatorSupportModel from "./info/CaseRadiatorSupport.entity";
import CaseHardDriveSupportModel from "./info/CaseHardDriveSupport.entity";
import CaseMainboardSupportModel from "./info/CaseMainboardSupport.entity";
import CasePSUSupportModel from "./info/CasePSUSupport.entity";
import FanSpecModel from "./info/FanSpec.entity";
import CPUSpecModel from "./info/CPUSpec.entity";
import CPUPerformanceModel from "./info/CPUPerformance.entity";
import CPUMemoryModel from "./info/CPUMemory.entity";
import CPUCoreConfigModel from "./info/CPUCoreConfig.entity";
import GPUSpecModel from "./info/GPUSpec.entity";
import GPUPerformanceModel from "./info/GPUPerformance.entity";
import GPUMemoryModel from "./info/GPUMemory.entity";
import GPUFeatureModel from "./info/GPUFeature.entity";
import ProcessorCacheModel from "./info/ProcessorCache.entity";
import GraphicCardSpecModel from "./info/GraphicCardSpec.entity";
import GraphicCardPortModel from "./info/GraphicCardPort.entity";
import MainboardSpecModel from "./info/MainboardSpec.entity";
import MainboardPowerConnectorModel from "./info/MainboardPowerConnector.entity";
import MainboardPCIeModel from "./info/MainboardPCIe.entity";
import MainboardStorageConnectorModel from "./info/MainboardStorageConnector.entity";
import MainboardUSBConnectorModel from "./info/MainboardUSBConnector.entity";
import MainboardFanConnectorModel from "./info/MainboardFanConnector.entity";
import RAMSpecModel from "./info/RAMSpec.entity";
import SSDSpecModel from "./info/SSDSpec.entity";
import HDDSpecModel from "./info/HDDSpec.entity";
import StoragePerformanceModel from "./info/StoragePerformance.entity";
import StorageCacheModel from "./info/StorageCache.entity";
import PSUSpecModel from "./info/PSUSpec.entity";
import PSUConnectorModel from "./info/PSUConnector.entity";
import CPUBlockSpecModel from "./info/CPUBlockSpec.entity";
import PumpSpecModel from "./info/PumpSpec.entity";
import RadiatorSpecModel from "./info/RadiatorSpec.entity";
import CPUBlockSocketModel from "./info/CPUBlockSocketSupport.entity";
import PartExternalPortModel from "./info/PartExternalPorts.entity";

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
export default class PartInformation extends Model implements Part.Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [Object.values(Products)] },
  })
  declare part: Products;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @Unique
  @Column(DataType.STRING)
  declare code_name: string;

  @Column(DataType.STRING)
  declare brand: string | null;

  @Column(DataType.STRING)
  declare series: string | null;

  @Column(DataType.DATE)
  declare launch_date: Date | null;

  @Column({ type: DataType.STRING, validate: { isUrl: true } })
  declare url: string | null;

  @Column({ type: DataType.STRING, validate: { isUrl: true } })
  declare image_url: string | null;

  @HasOne(() => CPUSpecModel)
  declare [Infos.CPU_SPEC]: CPUSpecModel | null;

  @HasOne(() => CPUPerformanceModel)
  declare [Infos.CPU_PERF]: CPUPerformanceModel | null;

  @HasMany(() => CPUCoreConfigModel)
  declare [Infos.CPU_CORES]: CPUCoreConfigModel[];

  @HasMany(() => CPUMemoryModel)
  declare [Infos.CPU_MEMORY]: CPUMemoryModel[];

  @HasOne(() => GPUSpecModel)
  declare [Infos.GPU_SPEC]: GPUSpecModel | null;

  @HasOne(() => GPUPerformanceModel)
  declare [Infos.GPU_PERF]: GPUPerformanceModel | null;

  @HasOne(() => GPUMemoryModel)
  declare [Infos.GPU_MEMORY]: GPUMemoryModel | null;

  @HasOne(() => GPUFeatureModel)
  declare [Infos.GPU_FEAT]: GPUFeatureModel | null;

  @HasOne(() => ProcessorCacheModel)
  declare [Infos.PROCESSOR_CACHE]: ProcessorCacheModel | null;

  @HasOne(() => GraphicCardSpecModel)
  declare [Infos.GRAPHIC_CARD_SPEC]: GraphicCardSpecModel | null;

  @HasMany(() => GraphicCardPortModel)
  declare [Infos.GRAPHIC_CARD_PORT]: GraphicCardPortModel[];

  @HasOne(() => MainboardSpecModel)
  declare [Infos.MAIN_SPEC]: MainboardSpecModel | null;

  @HasMany(() => MainboardPowerConnectorModel)
  declare [Infos.MAIN_POWER]: MainboardPowerConnectorModel[];

  @HasMany(() => MainboardPCIeModel)
  declare [Infos.MAIN_PCIE]: MainboardPCIeModel[];

  @HasMany(() => MainboardStorageConnectorModel)
  declare [Infos.MAIN_STORAGE]: MainboardStorageConnectorModel[];

  @HasMany(() => MainboardUSBConnectorModel)
  declare [Infos.MAIN_USB]: MainboardUSBConnectorModel[];

  @HasMany(() => MainboardFanConnectorModel)
  declare [Infos.MAIN_FAN]: MainboardFanConnectorModel[];

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

  @HasMany(() => PSUConnectorModel)
  declare [Infos.PSU_CONNECTOR]: PSUConnectorModel[];

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

  @HasMany(() => PartExternalPortModel)
  declare [Infos.EXTERNAL_PORTS]: PartExternalPortModel[];
}


