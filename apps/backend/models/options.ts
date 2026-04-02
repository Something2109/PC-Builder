import { SequelizeOptions } from "sequelize-typescript";
import { ArticleModel } from "./articles/article";
import { UserModel } from "./user/User";
import { RetailProduct } from "./sellers/SellerProduct";
import { PartInformation } from "./parts";
import { CaseSpecModel } from "./parts/info/CaseSpec";
import { CaseFanSupportModel } from "./parts/info/CaseFanSupport";
import { CaseRadiatorSupportModel } from "./parts/info/CaseRadiatorSupport";
import { CaseHardDriveSupportModel } from "./parts/info/CaseHardDriveSupport";
import { CaseMainboardSupportModel } from "./parts/info/CaseMainboardSupport";
import { CasePSUSupportModel } from "./parts/info/CasePSUSupport";
import { FanSpecModel } from "./parts/info/FanSpec";
import { CPUSpecModel } from "./parts/info/CPUSpec";
import { CPUPerformanceModel } from "./parts/info/CPUPerformance";
import { CPUCoreConfigModel } from "./parts/info/CPUCoreConfig";
import { CPUMemoryModel } from "./parts/info/CPUMemory";
import { GPUSpecModel } from "./parts/info/GPUSpec";
import { GPUPerformanceModel } from "./parts/info/GPUPerformance";
import { GPUMemoryModel } from "./parts/info/GPUMemory";
import { GPUFeatureModel } from "./parts/info/GPUFeature";
import { ProcessorCacheModel } from "./parts/info/ProcessorCache";
import { GraphicCardSpecModel } from "./parts/info/GraphicCardSpec";
import { GraphicCardPortModel } from "./parts/info/GraphicCardPort";
import { MainboardSpecModel } from "./parts/info/MainboardSpec";
import { MainboardPowerConnectorModel } from "./parts/info/MainboardPowerConnector";
import { MainboardPCIeModel } from "./parts/info/MainboardPCIe";
import { MainboardStorageConnectorModel } from "./parts/info/MainboardStorageConnector";
import { MainboardUSBConnectorModel } from "./parts/info/MainboardUSBConnector";
import { MainboardFanConnectorModel } from "./parts/info/MainboardFanConnector";
import { RAMSpecModel } from "./parts/info/RAMSpec";
import { SSDSpecModel } from "./parts/info/SSDSpec";
import { HDDSpecModel } from "./parts/info/HDDSpec";
import { StoragePerformanceModel } from "./parts/info/StoragePerformance";
import { StorageCacheModel } from "./parts/info/StorageCache";
import { PSUSpecModel } from "./parts/info/PSUSpec";
import { PSUConnectorModel } from "./parts/info/PSUConnector";
import { CPUBlockSpecModel } from "./parts/info/CPUBlockSpec";
import { PumpSpecModel } from "./parts/info/PumpSpec";
import { RadiatorSpecModel } from "./parts/info/RadiatorSpec";
import { CPUBlockSocketModel } from "./parts/info/CPUBlockSocketSupport";
import { PartExternalPortModel } from "./parts/info/PartExternalPorts";

export const ConnectionOptions: SequelizeOptions = {
  models: [
    ArticleModel,
    UserModel,
    RetailProduct,
    PartInformation,
    CPUSpecModel,
    CPUPerformanceModel,
    CPUMemoryModel,
    CPUCoreConfigModel,
    GPUSpecModel,
    GPUPerformanceModel,
    GPUMemoryModel,
    GPUFeatureModel,
    ProcessorCacheModel,
    GraphicCardSpecModel,
    GraphicCardPortModel,
    MainboardSpecModel,
    MainboardPowerConnectorModel,
    MainboardPCIeModel,
    MainboardStorageConnectorModel,
    MainboardUSBConnectorModel,
    MainboardFanConnectorModel,
    RAMSpecModel,
    SSDSpecModel,
    HDDSpecModel,
    StoragePerformanceModel,
    StorageCacheModel,
    PSUSpecModel,
    PSUConnectorModel,
    CaseSpecModel,
    CaseFanSupportModel,
    CaseMainboardSupportModel,
    CaseHardDriveSupportModel,
    CaseRadiatorSupportModel,
    CasePSUSupportModel,
    FanSpecModel,
    CPUBlockSpecModel,
    CPUBlockSocketModel,
    PumpSpecModel,
    RadiatorSpecModel,
    PartExternalPortModel,
  ],
  define: {
    freezeTableName: true,
    underscored: true,
  },
};
