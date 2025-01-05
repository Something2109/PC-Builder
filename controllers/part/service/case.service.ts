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
import { PartInformation } from "@/models/parts/tables/Part";

type Detail = Part.BasicInfo & {
  [Products.CASE]: Case.Info;
};

@Injectable()
class CaseService extends BaseDetailPartService<Detail> {
  readonly part = Products.CASE;

  async buildPart({
    [this.part]: data,
    ...part
  }: DetailInfoOptions): Promise<PartInformation | string> {
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

    const instance = await super.buildPart({ ...part, [this.part]: data });
    if (typeof instance === "string") return instance;

    this.setMainboardSupport(instance, mainboard_support);
    this.setRadiatorSupport(instance, radiator_support);
    this.setFanSupport(instance, fan_support);
    this.setHardDriveSupport(instance, hard_drive_support);
    this.setPSUSupport(instance, psu_support);

    return instance;
  }

  protected async savePart(instance: PartInformation): Promise<void> {
    await super.savePart(instance);

    const mainboard = instance[this.part];

    if (mainboard) {
      await Promise.all([
        ...mainboard.mainboard_support_data?.map((support) => support.save()),
        ...mainboard.radiator_support_data?.map((support) => support.save()),
        ...mainboard.fan_support_data?.map((support) => support.save()),
        ...mainboard.hard_drive_support_data?.map((support) => support.save()),
        ...mainboard.psu_support_data?.map((support) => support.save()),
      ]);
    }
  }

  async setPart(
    { [this.part]: data, ...part }: DetailInfoOptions,
    id: string
  ): Promise<PartInformation | string | null> {
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

    const instance = await super.setPart({ ...part, [this.part]: data }, id);
    if (!instance || typeof instance === "string") return instance;

    this.setMainboardSupport(instance, mainboard_support);
    this.setRadiatorSupport(instance, radiator_support);
    this.setFanSupport(instance, fan_support);
    this.setHardDriveSupport(instance, hard_drive_support);
    this.setPSUSupport(instance, psu_support);

    return instance;
  }

  private async setMainboardSupport(
    { [this.part]: instance, id }: PartInformation,
    mainboard_support?: FormFactor.Mainboard[]
  ) {
    if (instance && mainboard_support) {
      await Promise.all([
        instance.mainboard_support_data?.map((support) => support.destroy()),
      ]);

      const mainboard_support_data = CaseMainboardSupportModel.bulkBuild(
        mainboard_support.map((form_factor) => ({ id, form_factor }))
      );

      instance.mainboard_support_data = mainboard_support_data;
      instance.dataValues.mainboard_support_data = mainboard_support_data;
    }
  }

  private async setRadiatorSupport(
    { [this.part]: instance, id }: PartInformation,
    radiator_support?: Case.RadiatorSupport
  ) {
    if (instance && radiator_support) {
      await Promise.all([
        instance.radiator_support_data?.map((support) => support.destroy()),
      ]);

      const radiator_support_data: CaseRadiatorSupportModel[] = [];

      Object.entries(radiator_support).reduce(
        (acc, [case_side, form_factors]) => {
          acc.push(
            ...CaseRadiatorSupportModel.bulkBuild(
              form_factors.map((form_factor) => ({
                id,
                case_side,
                form_factor,
              }))
            )
          );
          return acc;
        },
        radiator_support_data
      );

      instance.radiator_support_data = radiator_support_data;
      instance.dataValues.radiator_support_data = radiator_support_data;
    }
  }

  private async setFanSupport(
    { [this.part]: instance, id }: PartInformation,
    fan_support?: Case.FanSupport
  ) {
    if (instance && fan_support) {
      await Promise.all([
        instance.fan_support_data?.map((support) => support.destroy()),
      ]);

      const fan_support_data: CaseFanSupportModel[] = [];

      Object.entries(fan_support).reduce((acc, [case_side, fan_size]) => {
        acc.push(
          ...CaseFanSupportModel.bulkBuild(
            Object.entries(fan_size).map(([form_factor, count]) => ({
              id,
              case_side,
              form_factor,
              count,
            }))
          )
        );
        return acc;
      }, fan_support_data);

      instance.fan_support_data = fan_support_data;
      instance.dataValues.fan_support_data = fan_support_data;
    }
  }

  private async setHardDriveSupport(
    { [this.part]: instance, id }: PartInformation,
    hard_drive_support?: Case.HardDriveSupport
  ) {
    if (instance && hard_drive_support) {
      await Promise.all([
        instance.hard_drive_support_data?.map((support) => support.destroy()),
      ]);

      const hard_drive_support_data: CaseHardDriveSupportModel[] = [];

      Object.entries(hard_drive_support).reduce((acc, [place, drive_side]) => {
        acc.push(
          ...CaseHardDriveSupportModel.bulkBuild(
            Object.entries(drive_side).map(([form_factor, count]) => ({
              id,
              place,
              form_factor,
              count,
            }))
          )
        );
        return acc;
      }, hard_drive_support_data);

      instance.hard_drive_support_data = hard_drive_support_data;
      instance.dataValues.hard_drive_support_data = hard_drive_support_data;
    }
  }

  private async setPSUSupport(
    { [this.part]: instance, id }: PartInformation,
    psu_support?: FormFactor.PSU[]
  ) {
    if (instance && psu_support) {
      await Promise.all([
        instance.psu_support_data?.map((support) => support.destroy()),
      ]);

      const psu_support_data = CasePSUSupportModel.bulkBuild(
        psu_support.map((form_factor) => ({ id, form_factor }))
      );

      instance.psu_support_data = psu_support_data;
      instance.dataValues.psu_support_data = psu_support_data;
    }
  }
}

export { CaseService };
