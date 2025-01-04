import { Injectable } from "@nestjs/common";
import {
  CaseFanSupportModel,
  CaseHardDriveSupportModel,
  CaseMainboardSupportModel,
  CasePSUSupportModel,
  CaseRadiatorSupportModel,
} from "@/models/parts/tables/Case";
import Part from "@/utils/interface/part/Parts";
import Case from "@/utils/interface/part/Case";
import { FormFactor } from "@/utils/interface/utils";
import { DetailInfoOptions } from "@/utils/interface";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Products.CASE]: Case.Info;
};

@Injectable()
class CaseService extends BaseDetailPartService<Detail> {
  readonly part = Products.CASE;

  async create({
    [this.part]: data,
    ...part
  }: DetailInfoOptions): Promise<string | Detail> {
    let mainboard_support: FormFactor.Mainboard[] | undefined,
      radiator_support: Case.RadiatorSupport | undefined,
      fan_support: Case.FanSupport | undefined,
      hard_drive_support: Case.HardDriveSupport | undefined,
      psu_support: FormFactor.PSU[] | undefined;
    if (data)
      ({
        mainboard_support,
        radiator_support,
        fan_support,
        hard_drive_support,
        psu_support,
        ...data
      } = data);

    const partInstance = await super.create({ ...part, [this.part]: data });
    if (typeof partInstance === "string") return partInstance;

    await Promise.all([
      this.setMainboardSupport(partInstance.id, mainboard_support),
      this.setRadiatorSupport(partInstance.id, radiator_support),
      this.setFanSupport(partInstance.id, fan_support),
      this.setHardDriveSupport(partInstance.id, hard_drive_support),
      this.setPSUSupport(partInstance.id, psu_support),
    ]);

    return (await this.get(partInstance.id)) as Detail;
  }

  async set(
    { [this.part]: data, ...part }: DetailInfoOptions,
    id: string
  ): Promise<string | Detail | null> {
    let mainboard_support: FormFactor.Mainboard[] | undefined,
      radiator_support: Case.RadiatorSupport | undefined,
      fan_support: Case.FanSupport | undefined,
      hard_drive_support: Case.HardDriveSupport | undefined,
      psu_support: FormFactor.PSU[] | undefined;
    if (data)
      ({
        mainboard_support,
        radiator_support,
        fan_support,
        hard_drive_support,
        psu_support,
        ...data
      } = data);

    const partInstance = await super.set({ ...part, [this.part]: data }, id);
    if (!partInstance || typeof partInstance === "string") return partInstance;

    await Promise.all([
      this.setMainboardSupport(partInstance.id, mainboard_support),
      this.setRadiatorSupport(partInstance.id, radiator_support),
      this.setFanSupport(partInstance.id, fan_support),
      this.setHardDriveSupport(partInstance.id, hard_drive_support),
      this.setPSUSupport(partInstance.id, psu_support),
    ]);

    return (await this.get(id)) as Detail;
  }

  private async setMainboardSupport(
    id: string,
    mainboard_support?: FormFactor.Mainboard[]
  ) {
    if (mainboard_support) {
      await CaseMainboardSupportModel.destroy({ where: { id } });

      await CaseMainboardSupportModel.bulkCreate(
        mainboard_support.map((form_factor) => ({ id, form_factor }))
      );
    }
  }

  private async setRadiatorSupport(
    id: string,
    radiator_support?: Case.RadiatorSupport
  ) {
    if (radiator_support) {
      await CaseRadiatorSupportModel.destroy({ where: { id } });

      const promises = Object.entries(radiator_support).map(
        ([case_side, form_factors]) =>
          CaseRadiatorSupportModel.bulkCreate(
            form_factors.map((form_factor) => ({ id, case_side, form_factor }))
          )
      );

      await Promise.all(promises);
    }
  }

  private async setFanSupport(id: string, fan_support?: Case.FanSupport) {
    if (fan_support) {
      await CaseFanSupportModel.destroy({ where: { id } });

      const promises = Object.entries(fan_support).map(
        ([case_side, fan_size]) =>
          CaseFanSupportModel.bulkCreate(
            Object.entries(fan_size).map(([form_factor, count]) => ({
              id,
              case_side,
              form_factor,
              count,
            }))
          )
      );

      await Promise.all(promises);
    }
  }

  private async setHardDriveSupport(
    id: string,
    hard_drive_support?: Case.HardDriveSupport
  ) {
    if (hard_drive_support) {
      await CaseHardDriveSupportModel.destroy({ where: { id } });

      const promises = Object.entries(hard_drive_support).map(
        ([place, drive_side]) =>
          CaseHardDriveSupportModel.bulkCreate(
            Object.entries(drive_side).map(([form_factor, count]) => ({
              id,
              place,
              form_factor,
              count,
            }))
          )
      );

      await Promise.all(promises);
    }
  }

  private async setPSUSupport(id: string, psu_support?: FormFactor.PSU[]) {
    if (psu_support) {
      await CasePSUSupportModel.destroy({ where: { id } });

      await CasePSUSupportModel.bulkCreate(
        psu_support.map((form_factor) => ({ id, form_factor }))
      );
    }
  }
}

export { CaseService };
