import { DataTypes } from "sequelize";
import {
  BasePartTable,
  BaseInformation,
  BaseModelOptions,
  Tables,
} from "../interface";
import { GPU } from "./GPU";

type APIDisplayInterface = {
  HDMI?: number;
  DisplayPort?: number;
  DVI_D?: number;
};

class GraphicCard extends BasePartTable {
  declare width: number;
  declare length: number;
  declare height: number;

  declare base_frequency: number;
  declare boost_frequency: number;

  declare pcie?: number;
  declare minimum_psu?: number;
  declare power_connector?: string;

  declare gpu_id: string;
}

GraphicCard.init(
  {
    ...BaseInformation,

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
    ...BaseModelOptions,
    modelName: Tables.GRAPHIC_CARD,
  }
);

GPU.hasMany(GraphicCard, {
  foreignKey: {
    name: "gpu_id",
    allowNull: false,
  },
});
GraphicCard.belongsTo(GPU, {
  foreignKey: {
    name: "gpu_id",
    allowNull: false,
  },
});

export { GraphicCard, type APIDisplayInterface };
