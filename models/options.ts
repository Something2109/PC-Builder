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
import { GPUSpecModel } from "./parts/info/GPUSpec";
import { GPUPerformanceModel } from "./parts/info/GPUPerformance";
import { GPUFeatureModel } from "./parts/info/GPUFeature";
import { ProcessorCacheModel } from "./parts/info/ProcessorCache";
import { ProcessorMemoryModel } from "./parts/info/ProcessorMemorySpec";
import { GraphicCardSpecModel } from "./parts/info/GraphicCardSpec";
import { MainboardSpecModel } from "./parts/info/MainboardSpec";
import { MainboardPCIeModel } from "./parts/info/MainboardPCIe";
import { MainboardStorageConnectorModel } from "./parts/info/MainboardStorageConnector";
import { MainboardUSBConnectorModel } from "./parts/info/MainboardUSBConnector";
import { RAMSpecModel } from "./parts/info/RAMSpec";
import { SSDSpecModel } from "./parts/info/SSDSpec";
import { HDDSpecModel } from "./parts/info/HDDSpec";
import { StoragePerformanceModel } from "./parts/info/StoragePerformance";
import { StorageCacheModel } from "./parts/info/StorageCache";
import { PSUSpecModel } from "./parts/info/PSUSpec";
import { CPUBlockSpecModel } from "./parts/info/CPUBlockSpec";
import { PumpSpecModel } from "./parts/info/PumpSpec";
import { RadiatorSpecModel } from "./parts/info/RadiatorSpec";
import { CPUBlockSocketModel } from "./parts/info/CPUBlockSocketSupport";

export const ConnectionOptions: SequelizeOptions = {
  models: [
    ArticleModel,
    UserModel,
    RetailProduct,
    PartInformation,
    CPUSpecModel,
    CPUPerformanceModel,
    CPUCoreConfigModel,
    GPUSpecModel,
    GPUPerformanceModel,
    GPUFeatureModel,
    ProcessorCacheModel,
    ProcessorMemoryModel,
    GraphicCardSpecModel,
    MainboardSpecModel,
    MainboardPCIeModel,
    MainboardStorageConnectorModel,
    MainboardUSBConnectorModel,
    RAMSpecModel,
    SSDSpecModel,
    HDDSpecModel,
    StoragePerformanceModel,
    StorageCacheModel,
    PSUSpecModel,
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
  ],
  define: {
    freezeTableName: true,
    underscored: true,
  },
};
