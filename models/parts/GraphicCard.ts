import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, Tables } from "../interface";
import { GPU } from "./GPU";
import { PartInformation } from "./Part";

type APIDisplayInterface = {
  HDMI?: number;
  DisplayPort?: number;
  DVI_D?: number;
};

class GraphicCard extends Model<
  InferAttributes<GraphicCard>,
  InferCreationAttributes<GraphicCard>
> {
  declare id: ForeignKey<string>;

  declare width: number;
  declare length: number;
  declare height: number;

  declare base_frequency: number;
  declare boost_frequency: number;

  declare pcie?: number;
  declare minimum_psu?: number;
  declare power_connector?: string;

  declare gpu_id: ForeignKey<string>;
}

GraphicCard.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
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

    gpu_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.GRAPHIC_CARD,
  }
);

PartInformation.hasOne(GPU, {
  foreignKey: "id",
});
GPU.belongsTo(PartInformation, {
  foreignKey: "id",
});

GPU.hasMany(GraphicCard, {
  foreignKey: "gpu_id",
});
GraphicCard.belongsTo(GPU, {
  foreignKey: "gpu_id",
});

export { GraphicCard, type APIDisplayInterface };
