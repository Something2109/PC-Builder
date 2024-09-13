import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, Tables } from "../interface";
import { PartInformation } from "./Part";

type FanSize = 120 | 140;

type AIOSize = 120 | 140 | 240 | 280 | 360 | 420;

type CaseSide = "top" | "bottom" | "front" | "rear" | "side";

type FanSupport = {
  [side in CaseSide]: {
    [size in FanSize]: number;
  };
};

type AIOSupport = {
  [side in CaseSide]: AIOSize[];
};

type HardDriveSupport = {
  2.5?: number;
  3.5?: number;
  combo: number;
};

class Case extends Model<InferAttributes<Case>, InferCreationAttributes<Case>> {
  declare id: ForeignKey<string>;

  declare form_factor: string;
  declare width: number;
  declare length: number;
  declare height: number;

  declare io_ports: {};

  declare mb_support: string[];
  declare expansion_slot: number;

  declare max_cooler_height: number;

  declare aio_support: AIOSupport;
  declare fan_support: FanSupport;

  declare hard_drive_support: HardDriveSupport;

  declare psu_support: string;
  declare max_psu_length?: number;
}

Case.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    form_factor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    width: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    length: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    io_ports: {
      type: DataTypes.VIRTUAL,
    },
    mb_support: {
      type: DataTypes.VIRTUAL,
    },

    expansion_slot: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_cooler_height: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    aio_support: {
      type: DataTypes.VIRTUAL,
    },
    fan_support: {
      type: DataTypes.VIRTUAL,
    },
    hard_drive_support: {
      type: DataTypes.VIRTUAL,
    },

    psu_support: {
      type: DataTypes.VIRTUAL,
    },
    max_psu_length: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.CASE,
  }
);

PartInformation.hasOne(Case, {
  foreignKey: "id",
});
Case.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { Case };
