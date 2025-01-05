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
import { WhereOptions } from "sequelize";

@Scopes(() => ({
  [ModelScopes.SUMMARY]: { attributes: ["id", ...Case.SummaryAttributes] },
  [ModelScopes.FILTER]: ({
    mainboard_support,
    ...rest
  }: Case.FilterOptions) => {
    const filter: WhereOptions = {
      ...rest,
    };

    return { where: filter };
  },
  [ModelScopes.DETAIL]: {
    ...PartDefaultScope,
    include: [
      { model: CaseMainboardSupportModel, attributes: ["form_factor"] },
      {
        model: CaseFanSupportModel,
        attributes: ["case_side", "form_factor", "count"],
      },
      {
        model: CaseRadiatorSupportModel,
        attributes: ["case_side", "form_factor"],
      },
      {
        model: CaseHardDriveSupportModel,
        attributes: ["place", "form_factor", "count"],
      },
      { model: CasePSUSupportModel, attributes: ["form_factor"] },
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
  get mainboard_support(): FormFactor.Mainboard[] | null {
    const data = this.getDataValue(
      "mainboard_support_data"
    ) as CaseMainboardSupportModel[];
    this.setDataValue("mainboard_support_data", undefined);

    if (!data) return null;

    return data.map(({ form_factor }) => form_factor);
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
  get radiator_support(): Case.RadiatorSupport | null {
    const data = this.getDataValue(
      "radiator_support_data"
    ) as CaseRadiatorSupportModel[];
    this.setDataValue("radiator_support_data", undefined);

    if (!data) return null;

    return data.reduce((acc, { case_side, form_factor }) => {
      if (!acc[case_side]) acc[case_side] = [];

      acc[case_side].push(form_factor);
      return acc;
    }, {} as Case.RadiatorSupport);
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
  get fan_support(): Case.FanSupport | null {
    const data = this.getDataValue("fan_support_data") as CaseFanSupportModel[];
    this.setDataValue("fan_support_data", undefined);

    if (!data) return null;

    return data.reduce((acc, { case_side, form_factor, count }) => {
      if (!acc[case_side]) acc[case_side] = {};

      acc[case_side][form_factor] = count;
      return acc;
    }, {} as Case.FanSupport);
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
  get hard_drive_support(): Case.HardDriveSupport | null {
    const data = this.getDataValue(
      "hard_drive_support_data"
    ) as CaseHardDriveSupportModel[];
    this.setDataValue("hard_drive_support_data", undefined);

    if (!data) return null;

    return data.reduce((acc, { place, form_factor, count }) => {
      if (!acc[place]) acc[place] = {};

      acc[place][form_factor] = count;
      return acc;
    }, {} as Case.HardDriveSupport);
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
  get psu_support(): FormFactor.PSU[] | null {
    const data = this.getDataValue("psu_support_data") as CasePSUSupportModel[];
    this.setDataValue("psu_support_data", undefined);

    if (!data) return null;

    return data.map(({ form_factor }) => form_factor);
  }

  @Column(DataType.FLOAT)
  declare max_psu_length: number | null;

  @Column(DataType.TEXT)
  get front_panel_ports(): Case.FrontPanelPort | null {
    const data = this.getDataValue("front_panel_ports");

    return data ? JSON.parse(data) : null;
  }

  set front_panel_ports(value: Case.FrontPanelPort | null) {
    this.setDataValue(
      "front_panel_ports",
      value ? JSON.stringify(value) : null
    );
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
