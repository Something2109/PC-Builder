import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
} from "../../interface";
import { PartInformation } from "./Part";
import { FormFactor } from "@/utils/interface/utils";
import Case from "@/utils/interface/part/Case";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from "sequelize-typescript";
import { SaveOptions } from "sequelize";

@Scopes(() => ({
  [ModelScopes.SUMMARY]: {
    attributes: ["id", ...Case.SummaryAttributes],
    include: [CaseMainboardSupportModel, CasePSUSupportModel],
  },
  [ModelScopes.FILTER]: (options?: Case.FilterOptions) => {
    const { mainboard_support, psu_support, ...where } = options ?? {};
    return {
      where,
      include: [
        {
          model: CaseMainboardSupportModel,
          where: mainboard_support ? { form_factor: mainboard_support } : {},
          required: Boolean(mainboard_support),
        },
        {
          model: CasePSUSupportModel,
          where: psu_support ? { form_factor: psu_support } : {},
          required: Boolean(psu_support),
        },
      ],
    };
  },
  [ModelScopes.DETAIL]: {
    ...PartDefaultScope,
    include: [
      CaseMainboardSupportModel,
      CaseFanSupportModel,
      CaseRadiatorSupportModel,
      CaseHardDriveSupportModel,
      CasePSUSupportModel,
    ],
  },
}))
@Table({ modelName: Tables.CASE })
class CaseModel extends Model implements PartDetailTable<Case.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Case.options] },
  })
  declare form_factor: FormFactor.Case | null;

  @Column(DataType.FLOAT)
  declare width: number | null;

  @Column(DataType.FLOAT)
  declare length: number | null;

  @Column(DataType.FLOAT)
  declare height: number | null;

  declare io_ports: {} | null;

  @Column(DataType.INTEGER)
  declare expansion_slot: number | null;

  @Column(DataType.FLOAT)
  declare max_cooler_height: number | null;

  /**
   * Declare the mainboard support object as a virtual column
   * extracting the {@link mainboard_support_data} assossiated with
   * {@link CaseMainboardSupportModel} from the model
   * and converting it to a {@link FormFactor.Mainboard} array.
   */

  @HasMany(() => CaseMainboardSupportModel)
  declare mainboard_support_data: CaseMainboardSupportModel[];

  @Column(DataType.VIRTUAL)
  get mainboard_support(): FormFactor.Mainboard[] | undefined {
    const data: CaseMainboardSupportModel[] | undefined = this.getDataValue(
      "mainboard_support_data"
    );

    if (!data) return undefined;

    this.setDataValue("mainboard_support_data", undefined);
    return data.map(({ form_factor }) => form_factor);
  }

  set mainboard_support(data: FormFactor.Mainboard[] | null) {
    const current: CaseMainboardSupportModel[] | undefined = this.getDataValue(
      "mainboard_support_data"
    );

    if (data === null && current) current.map((value) => value.destroy());

    if (!data) return;

    const newData = this.mainboardResolver(data, current ?? []);

    this.mainboard_support_data = newData;
    this.setDataValue("mainboard_support_data", newData);
  }

  private mainboardResolver(
    data: FormFactor.Mainboard[],
    current: CaseMainboardSupportModel[]
  ): CaseMainboardSupportModel[] {
    const newData = current.reduce((acc, val) => {
      acc[val.form_factor] = val;
      return acc;
    }, {} as { [key in FormFactor.Mainboard]?: CaseMainboardSupportModel });

    data.forEach((form_factor) => {
      if (!newData[form_factor]) {
        newData[form_factor] = CaseMainboardSupportModel.build({
          id: this.id,
          form_factor,
        });
      }
    });

    Object.keys(newData)
      .filter((value) => !data.includes(value as FormFactor.Mainboard))
      .forEach((value) => {
        const form_factor = value as FormFactor.Mainboard;
        newData[form_factor]?.destroy();
        delete newData[form_factor];
      });

    return Object.values(newData);
  }

  /**
   * Declare the radiator support object as a virtual column
   * extracting the {@link radiator_support_data} assossiated with
   * {@link CaseRadiatorSupportModel} from the model
   * and converting it to a {@link Case.RadiatorSupport} object.
   */

  @HasMany(() => CaseRadiatorSupportModel)
  declare radiator_support_data: CaseRadiatorSupportModel[];

  @Column(DataType.VIRTUAL)
  get radiator_support(): Case.RadiatorSupport | undefined {
    const data: CaseRadiatorSupportModel[] | undefined = this.getDataValue(
      "radiator_support_data"
    );

    if (!data) return undefined;

    this.setDataValue("radiator_support_data", undefined);
    return data.reduce((acc, { case_side, form_factor }) => {
      if (!acc[case_side]) acc[case_side] = [];

      acc[case_side].push(form_factor);
      return acc;
    }, {} as Case.RadiatorSupport);
  }

  set radiator_support(data: Case.RadiatorSupport | null) {
    const current: CaseRadiatorSupportModel[] | undefined = this.getDataValue(
      "radiator_support_data"
    );

    if (data === null && current) current.map((value) => value.destroy());

    if (!data) return;

    const newData = this.radiatorResolver(data, current ?? []);

    this.radiator_support_data = newData;
    this.setDataValue("radiator_support_data", newData);
  }

  private radiatorResolver(
    data: Case.RadiatorSupport,
    current: CaseRadiatorSupportModel[]
  ): CaseRadiatorSupportModel[] {
    const currentSide = current.reduce((acc, value) => {
      const side = value.case_side;

      if (!acc[side]) acc[side] = [];
      acc[side].push(value);

      return acc;
    }, {} as { [key in Case.Side]?: CaseRadiatorSupportModel[] });

    Case.Side.options.forEach((case_side) => {
      if (!data[case_side]) {
        currentSide[case_side]?.map((value) => value.destroy());
        delete currentSide[case_side];
        return;
      }

      if (!currentSide[case_side]) {
        currentSide[case_side] = data[case_side].map((form_factor) =>
          CaseRadiatorSupportModel.build({
            id: this.id,
            case_side,
            form_factor,
          })
        );
        return;
      }

      currentSide[case_side] = this.caseSideRadiatorResolver(
        case_side,
        data[case_side],
        currentSide[case_side]
      );
    });

    return Object.values(currentSide).reduce((acc, value) => {
      acc.push(...value);
      return acc;
    }, []);
  }

  private caseSideRadiatorResolver(
    side: Case.Side,
    data: FormFactor.Radiator[],
    current: CaseRadiatorSupportModel[]
  ): CaseRadiatorSupportModel[] {
    const newData = current.reduce((acc, val) => {
      acc[val.form_factor] = val;
      return acc;
    }, {} as { [key in FormFactor.Radiator]?: CaseRadiatorSupportModel });

    data.forEach((form_factor) => {
      if (!newData[form_factor]) {
        newData[form_factor] = CaseRadiatorSupportModel.build({
          id: this.id,
          case_side: side,
          form_factor,
        });
      }
    });

    Object.keys(newData)
      .filter((value) => !data.includes(value as FormFactor.Radiator))
      .forEach((value) => {
        newData[value as FormFactor.Radiator]?.destroy();
        delete newData[value as FormFactor.Radiator];
      });

    return Object.values(newData);
  }

  /**
   * Declare the fan support object as a virtual column
   * extracting the {@link fan_support_data} assossiated with
   * {@link CaseFanSupportModel} from the model
   * and converting it to a {@link Case.FanSupport} object.
   */

  @HasMany(() => CaseFanSupportModel)
  declare fan_support_data: CaseFanSupportModel[];

  @Column(DataType.VIRTUAL)
  get fan_support(): Case.FanSupport | undefined {
    const data: CaseFanSupportModel[] | undefined =
      this.getDataValue("fan_support_data");

    if (!data) return undefined;

    this.setDataValue("fan_support_data", undefined);
    return data.reduce((acc, { case_side, form_factor, count }) => {
      if (!acc[case_side]) acc[case_side] = {};

      acc[case_side][form_factor] = count;
      return acc;
    }, {} as Case.FanSupport);
  }

  set fan_support(data: Case.FanSupport | null) {
    const current: CaseFanSupportModel[] | undefined =
      this.getDataValue("fan_support_data");

    if (data === null && current) current.map((value) => value.destroy());

    if (!data) return;

    const newData = this.fanResolver(data, current ?? []);

    this.fan_support_data = newData;
    this.setDataValue("fan_support_data", newData);
  }

  private fanResolver(
    data: Case.FanSupport,
    current: CaseFanSupportModel[]
  ): CaseFanSupportModel[] {
    const currentSide = current.reduce((acc, value) => {
      const side = value.case_side;

      if (!acc[side]) acc[side] = [];
      acc[side].push(value);

      return acc;
    }, {} as { [key in Case.Side]?: CaseFanSupportModel[] });

    Case.Side.options.forEach((case_side) => {
      if (!data[case_side]) {
        currentSide[case_side]?.map((value) => value.destroy());
        delete currentSide[case_side];
        return;
      }

      if (!currentSide[case_side]) {
        currentSide[case_side] = Object.entries(data[case_side]).map(
          ([form_factor, count]) =>
            CaseFanSupportModel.build({
              id: this.id,
              case_side,
              form_factor,
              count,
            })
        );
        return;
      }

      currentSide[case_side] = this.caseSideFanResolver(
        case_side,
        data[case_side],
        currentSide[case_side]
      );
    });

    return Object.values(currentSide).reduce((acc, value) => {
      acc.push(...value);
      return acc;
    }, []);
  }

  private caseSideFanResolver(
    case_side: Case.Side,
    data: { [key in FormFactor.Fan]?: number },
    current: CaseFanSupportModel[]
  ): CaseFanSupportModel[] {
    const newData = current.reduce((acc, val) => {
      acc[val.form_factor] = val;
      return acc;
    }, {} as { [key in FormFactor.Fan]?: CaseFanSupportModel });

    Object.entries(data).forEach(([key, count]) => {
      const form_factor = key as FormFactor.Fan;
      if (!newData[form_factor]) {
        newData[form_factor] = CaseFanSupportModel.build({
          id: this.id,
          case_side,
          form_factor,
        });
      }
      newData[form_factor].count = count;
    });

    Object.keys(newData)
      .filter(
        (value) => !Object.keys(data).includes(value as FormFactor.Radiator)
      )
      .forEach((value) => {
        const form_factor = value as FormFactor.Fan;
        newData[form_factor]?.destroy();
        delete newData[form_factor];
      });

    return Object.values(newData);
  }

  /**
   * Declare the hard drive support object as a virtual column
   * extracting the {@link hard_drive_support_data} assossiated with
   * {@link CaseHardDriveSupportModel} from the model
   * and converting it to a {@link Case.HardDriveSupport} object.
   */

  @HasMany(() => CaseHardDriveSupportModel)
  declare hard_drive_support_data: CaseHardDriveSupportModel[];

  @Column(DataType.VIRTUAL)
  get hard_drive_support(): Case.HardDriveSupport | undefined {
    const data: CaseHardDriveSupportModel[] | undefined = this.getDataValue(
      "hard_drive_support_data"
    );

    if (!data) return undefined;

    this.setDataValue("hard_drive_support_data", undefined);
    return data.reduce((acc, { place, form_factor, count }) => {
      if (!acc[place]) acc[place] = {};

      acc[place][form_factor] = count;
      return acc;
    }, {} as Case.HardDriveSupport);
  }

  set hard_drive_support(data: Case.HardDriveSupport | null) {
    const current: CaseHardDriveSupportModel[] | undefined = this.getDataValue(
      "hard_drive_support_data"
    );

    if (data === null && current) current.map((value) => value.destroy());

    if (!data) return;

    const newData = this.hardDriveResolver(data, current ?? []);

    this.hard_drive_support_data = newData;
    this.setDataValue("hard_drive_support_data", newData);
  }

  private hardDriveResolver(
    data: Case.HardDriveSupport,
    current: CaseHardDriveSupportModel[]
  ): CaseHardDriveSupportModel[] {
    const currentSide = current.reduce((acc, value) => {
      const side = value.place;

      if (!acc[side]) acc[side] = [];
      acc[side].push(value);

      return acc;
    }, {} as { [key in Case.HardDrivePlace]?: CaseHardDriveSupportModel[] });

    Case.HardDrivePlace.options.forEach((place) => {
      if (!data[place]) {
        currentSide[place]?.map((value) => value.destroy());
        delete currentSide[place];
        return;
      }

      if (!currentSide[place]) {
        currentSide[place] = Object.entries(data[place]).map(
          ([form_factor, count]) =>
            CaseHardDriveSupportModel.build({
              id: this.id,
              place,
              form_factor,
              count,
            })
        );
        return;
      }

      currentSide[place] = this.caseSideHardDriveResolver(
        place,
        data[place],
        currentSide[place]
      );
    });

    return Object.values(currentSide).reduce((acc, value) => {
      acc.push(...value);
      return acc;
    }, []);
  }

  private caseSideHardDriveResolver(
    place: Case.HardDrivePlace,
    data: { [key in Case.HardDriveSize]?: number },
    current: CaseHardDriveSupportModel[]
  ): CaseHardDriveSupportModel[] {
    const newData = current.reduce((acc, val) => {
      acc[val.form_factor] = val;
      return acc;
    }, {} as { [key in Case.HardDriveSize]?: CaseHardDriveSupportModel });

    Object.entries(data).forEach(([key, count]) => {
      const form_factor = key as Case.HardDriveSize;
      if (!newData[form_factor]) {
        newData[form_factor] = CaseHardDriveSupportModel.build({
          id: this.id,
          place,
          form_factor,
        });
      }
      newData[form_factor].count = count;
    });

    Object.keys(newData)
      .filter(
        (value) => !Object.keys(data).includes(value as FormFactor.Radiator)
      )
      .forEach((value) => {
        const form_factor = value as Case.HardDriveSize;
        newData[form_factor]?.destroy();
        delete newData[form_factor];
      });

    return Object.values(newData);
  }

  /**
   * Declare the psu support object as a virtual column
   * extracting the {@link psu_support_data} assossiated with
   * {@link CasePSUSupportModel} from the model
   * and converting it to a {@link PSUFormFactorType} array.
   */

  @HasMany(() => CasePSUSupportModel)
  declare psu_support_data: CasePSUSupportModel[];

  @Column(DataType.VIRTUAL)
  get psu_support(): FormFactor.PSU[] | undefined {
    const data: CasePSUSupportModel[] | undefined =
      this.getDataValue("psu_support_data");

    if (!data) return undefined;

    this.setDataValue("psu_support_data", undefined);
    return data.map(({ form_factor }) => form_factor);
  }

  set psu_support(data: FormFactor.PSU[] | null) {
    const current: CasePSUSupportModel[] | undefined =
      this.getDataValue("psu_support_data");

    if (data === null && current) current.map((value) => value.destroy());

    if (!data) return;

    const newData = this.psuResolver(data, current ?? []);

    this.psu_support_data = newData;
    this.setDataValue("psu_support_data", newData);
  }

  private psuResolver(
    data: FormFactor.PSU[],
    current: CasePSUSupportModel[]
  ): CasePSUSupportModel[] {
    const newData = current.reduce((acc, val) => {
      acc[val.form_factor] = val;
      return acc;
    }, {} as { [key in FormFactor.PSU]?: CasePSUSupportModel });

    data.forEach((form_factor) => {
      if (!newData[form_factor]) {
        newData[form_factor] = CasePSUSupportModel.build({
          id: this.id,
          form_factor,
        });
      }
    });

    Object.keys(newData)
      .filter((value) => !data.includes(value as FormFactor.PSU))
      .forEach((value) => {
        const form_factor = value as FormFactor.PSU;
        newData[form_factor]?.destroy();
        delete newData[form_factor];
      });

    return Object.values(newData);
  }

  @Column(DataType.FLOAT)
  declare max_psu_length: number | null;

  @Column(DataType.TEXT)
  get front_panel_ports(): Case.FrontPanelPort | undefined {
    const data = this.getDataValue("front_panel_ports");

    return data ? JSON.parse(data) : undefined;
  }

  set front_panel_ports(value: Case.FrontPanelPort | null) {
    this.setDataValue(
      "front_panel_ports",
      value ? JSON.stringify(value) : null
    );
  }

  async save(options?: SaveOptions<any> | undefined): Promise<this> {
    const result = await super.save(options);

    await Promise.all([
      ...this.mainboard_support_data?.map((support) => support.save(options)),
      ...this.radiator_support_data?.map((support) => support.save(options)),
      ...this.fan_support_data?.map((support) => support.save(options)),
      ...this.hard_drive_support_data?.map((support) => support.save(options)),
      ...this.psu_support_data?.map((support) => support.save(options)),
    ]);

    return result;
  }
}

/**
 * Define the mainboard support model for the case model.
 * The model is used for future search and filter operations.
 */
@Table({ modelName: Tables.CASE_MAINBOARD_SUPPORT })
class CaseMainboardSupportModel extends Model {
  @PrimaryKey
  @ForeignKey(() => CaseModel)
  @Column(DataType.UUID)
  declare id: string;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Mainboard.options] },
  })
  declare form_factor: FormFactor.Mainboard;
}

/**
 * Define the fan support model for the case model.
 * The model is used for future search and filter operations.
 */
@Table({ modelName: Tables.CASE_FAN_SUPPORT })
class CaseFanSupportModel extends Model {
  @PrimaryKey
  @ForeignKey(() => CaseModel)
  @Column(DataType.UUID)
  declare id: string;

  @PrimaryKey
  @Column({ type: DataType.STRING, validate: { isIn: [Case.Side.options] } })
  declare case_side: Case.Side;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Fan.options] },
  })
  declare form_factor: FormFactor.Fan;

  @Column(DataType.TINYINT)
  declare count: number;
}

/**
 * Define the radiator support model for the case model.
 * The model is used for future search and filter operations.
 */
@Table({ modelName: Tables.CASE_RADIATOR_SUPPORT })
class CaseRadiatorSupportModel extends Model {
  @PrimaryKey
  @ForeignKey(() => CaseModel)
  @Column(DataType.UUID)
  declare id: string;

  @PrimaryKey
  @Column({ type: DataType.STRING, validate: { isIn: [Case.Side.options] } })
  declare case_side: Case.Side;

  @PrimaryKey
  @Column(DataType.STRING)
  declare form_factor: FormFactor.Radiator;
}

/**
 * Define the hard drive support model for the case model.
 * The model is used for future search and filter operations.
 */
@Table({ modelName: Tables.CASE_HARD_DRIVE_SUPPORT })
class CaseHardDriveSupportModel extends Model {
  @PrimaryKey
  @ForeignKey(() => CaseModel)
  @Column(DataType.UUID)
  declare id: string;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [["Drive Bay", ...Case.Side.options]] },
  })
  declare place: keyof Case.HardDriveSupport;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [Case.HardDriveSize.options] },
  })
  declare form_factor: Case.HardDriveSize;

  @Column(DataType.TINYINT)
  declare count: number;
}

/**
 * Define the psu support model for the case model.
 * The model is used for future search and filter operations.
 */
@Table({ modelName: Tables.CASE_PSU_SUPPORT })
class CasePSUSupportModel extends Model {
  @PrimaryKey
  @ForeignKey(() => CaseModel)
  @Column(DataType.UUID)
  declare id: string;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.PSU.options] },
  })
  declare form_factor: FormFactor.PSU;
}

export {
  CaseModel,
  CaseMainboardSupportModel,
  CaseFanSupportModel,
  CaseRadiatorSupportModel,
  CaseHardDriveSupportModel,
  CasePSUSupportModel,
};
