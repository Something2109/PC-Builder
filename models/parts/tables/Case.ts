import { PartDetailTable, PartDefaultScope, Tables } from "../../interface";
import { PartInformation } from "./Part";
import { FormFactor } from "@/utils/interface/utils";
import Case from "@/utils/interface/part/Case";
import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from "sequelize-typescript";
import { Op, WhereOptions } from "sequelize";

@DefaultScope(() => PartDefaultScope)
@Scopes(() => ({
  summary: { attributes: [...Case.SummaryAttributes] },
  filter: ({ mainboard_support, ...rest }: Case.FilterOptions) => {
    const filter: WhereOptions = {
      ...rest,
    };

    return { where: filter };
  },
  detail: {
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    include: [
      {
        model: CaseMainboardSupportModel,
        attributes: ["mainboard_support"],
      },
      {
        model: CaseFanSupportModel,
        attributes: ["case_side", "fan_form_factor", "count"],
      },
      {
        model: CaseAIOSupportModel,
        attributes: ["case_side", "aio_form_factor"],
      },
      {
        model: CaseHardDriveSupportModel,
        attributes: ["place", "type", "count"],
      },
      {
        model: CasePSUSupportModel,
        attributes: ["psu_support"],
      },
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

    if (!data) return null;

    return data.map(({ mainboard_support }) => mainboard_support);
  }

  set mainboard_support(data: FormFactor.Mainboard[] | null) {
    if (!data) return;

    for (const mainboard_support of data) {
      CaseMainboardSupportModel.findOrCreate({
        where: { id: this.id, mainboard_support },
      });
    }
  }

  /**
   * Declare the aio support object as a virtual column
   * extracting the {@link aio_support_data} assossiated with
   * {@link CaseAIOSupportModel} from the model
   * and converting it to a {@link Case.AIOSupport} object.
   */

  @HasMany(() => CaseAIOSupportModel)
  declare aio_support_data: CaseAIOSupportModel[] | null;

  @Column(DataType.VIRTUAL)
  get aio_support(): Case.AIOSupport | null {
    const data = this.getDataValue("aio_support_data") as CaseAIOSupportModel[];

    if (!data) return null;

    return data.reduce((acc, { case_side, aio_form_factor }) => {
      if (!acc[case_side]) acc[case_side] = [];

      acc[case_side].push(aio_form_factor);
      return acc;
    }, {} as Case.AIOSupport);
  }

  set aio_support(data: Case.AIOSupport | null) {
    if (!data) return;

    for (const [case_side, aio_form_factors] of Object.entries(data)) {
      for (const aio_form_factor of aio_form_factors) {
        CaseAIOSupportModel.findOrCreate({
          where: { id: this.id, case_side, aio_form_factor },
          defaults: {},
        });
      }
    }
  }

  /**
   * Declare the fan support object as a virtual column
   * extracting the {@link fan_support_data} assossiated with
   * {@link CaseFanSupportModel} from the model
   * and converting it to a {@link Case.FanSupport} object.
   */

  @HasMany(() => CaseFanSupportModel)
  declare fan_support_data: CaseFanSupportModel[] | null;

  @Column(DataType.VIRTUAL)
  get fan_support(): Case.FanSupport | null {
    const data = this.getDataValue("fan_support_data") as CaseFanSupportModel[];

    if (!data) return null;

    return data.reduce((acc, { case_side, fan_form_factor, count }) => {
      if (!acc[case_side]) acc[case_side] = {};

      acc[case_side][fan_form_factor] = count;
      return acc;
    }, {} as Case.FanSupport);
  }

  set fan_support(data: Case.FanSupport | null) {
    if (!data) return;

    for (const [case_side, fan_form_factors] of Object.entries(data)) {
      for (const [fan_form_factor, count] of Object.entries(fan_form_factors)) {
        CaseFanSupportModel.findOrCreate({
          where: { id: this.id, case_side, fan_form_factor },
          defaults: { count },
        }).then(([fanSupport, created]) => {
          if (!created) fanSupport.update({ count });
        });
      }
    }
  }

  /**
   * Declare the hard drive support object as a virtual column
   * extracting the {@link hard_drive_support_data} assossiated with
   * {@link CaseHardDriveSupportModel} from the model
   * and converting it to a {@link Case.HardDriveSupport} object.
   */

  @HasMany(() => CaseHardDriveSupportModel)
  declare hard_drive_support_data: CaseHardDriveSupportModel[] | null;

  @Column(DataType.VIRTUAL)
  get hard_drive_support(): Case.HardDriveSupport | null {
    const data = this.getDataValue(
      "hard_drive_support_data"
    ) as CaseHardDriveSupportModel[];

    if (!data) return null;

    return data.reduce((acc, { place, type, count }) => {
      if (!acc[place]) acc[place] = {};

      acc[place][type] = count;
      return acc;
    }, {} as Case.HardDriveSupport);
  }

  set hard_drive_support(data: Case.HardDriveSupport | null) {
    if (!data) return;

    for (const [place, types] of Object.entries(data)) {
      for (const [type, count] of Object.entries(types)) {
        CaseHardDriveSupportModel.findOrCreate({
          where: { id: this.id, place, type },
          defaults: { count },
        }).then(([hardDriveSupport, created]) => {
          if (!created) hardDriveSupport.update({ count });
        });
      }
    }
  }

  /**
   * Declare the psu support object as a virtual column
   * extracting the {@link psu_support_data} assossiated with
   * {@link CasePSUSupportModel} from the model
   * and converting it to a {@link PSUFormFactorType} array.
   */

  @HasMany(() => CasePSUSupportModel)
  declare psu_support_data: CasePSUSupportModel[] | null;

  @Column(DataType.VIRTUAL)
  get psu_support(): FormFactor.PSU[] | null {
    const data = this.getDataValue("psu_support_data") as CasePSUSupportModel[];

    if (!data) return null;

    return data.map(({ psu_support }) => psu_support);
  }

  set psu_support(data: FormFactor.PSU[] | null) {
    if (!data) return;

    for (const psu_support of data) {
      CasePSUSupportModel.findOrCreate({
        where: { id: this.id, psu_support },
        defaults: {},
      });
    }
  }

  @Column(DataType.FLOAT)
  declare max_psu_length: number | null;

  @Column(DataType.TEXT)
  get front_panel_ports(): Case.FrontPanelPortType | null {
    const data = this.getDataValue("front_panel_ports");

    return data ? JSON.parse(data) : null;
  }

  set front_panel_ports(value: Case.FrontPanelPortType | null) {
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
  declare mainboard_support: FormFactor.Mainboard;
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
  declare fan_form_factor: FormFactor.Fan;

  @Column(DataType.TINYINT)
  declare count: number;
}

/**
 * Define the aio support model for the case model.
 * The model is used for future search and filter operations.
 */
@Table({ modelName: Tables.CASE_AIO_SUPPORT })
class CaseAIOSupportModel extends Model {
  @PrimaryKey
  @ForeignKey(() => CaseModel)
  @Column(DataType.UUID)
  declare id: string;

  @PrimaryKey
  @Column({ type: DataType.STRING, validate: { isIn: [Case.Side.options] } })
  declare case_side: Case.Side;

  @PrimaryKey
  @Column(DataType.STRING)
  declare aio_form_factor: FormFactor.AIO;
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
  declare type: Case.HardDriveSizeType;

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
  declare psu_support: FormFactor.PSU;
}

export {
  CaseModel,
  CaseMainboardSupportModel,
  CaseFanSupportModel,
  CaseAIOSupportModel,
  CaseHardDriveSupportModel,
  CasePSUSupportModel,
};
