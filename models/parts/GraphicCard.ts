import { DataTypes, Model } from "sequelize";
import { Connection } from "../Database";
import { Tables } from "../interface";
import { GPU } from "./GPU";

type APIDisplayInterface = {
  HDMI?: number;
  DisplayPort?: number;
  DVI_D?: number;
};

type APIGraphicCardProperties = {
  name: string;
  brand: string;
  series: string;
  launch_date?: Date;

  width: number;
  length: number;
  height: number;

  base_frequency: number;
  boost_frequency: number;

  pcie?: number;
  minimum_psu?: number;
  power_connector?: string;

  gpu_id: string;
};

class GraphicCard extends Model {
  declare name: string;
  declare brand: string;
  declare series: string;
  declare launch_date?: Date;

  declare width: number;
  declare length: number;
  declare height: number;

  declare base_frequency: number;
  declare boost_frequency: number;

  declare pcie?: string;
  declare minimum_psu?: number;
  declare power_connector?: string;
}

GraphicCard.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    series: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    launch_date: {
      type: DataTypes.DATE,
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

    base_frequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    boost_frequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    pcie: {
      type: DataTypes.INTEGER,
    },
    minimum_psu: {
      type: DataTypes.INTEGER,
    },
    power_connector: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: Connection,
    modelName: Tables.GRAPHIC_CARD,
  }
);
GPU.hasMany(GraphicCard, {
  foreignKey: "gpu_id",
});
GraphicCard.belongsTo(GPU, {
  foreignKey: "gpu_id",
});

export { GraphicCard, type APIGraphicCardProperties, type APIDisplayInterface };
