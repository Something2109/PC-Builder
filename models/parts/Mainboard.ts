import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, Tables } from "../interface";
import { PartInformation } from "./Part";

class Mainboard extends Model<
  InferAttributes<Mainboard>,
  InferCreationAttributes<Mainboard>
> {
  declare id: ForeignKey<string>;

  declare form_factor: string;

  declare socket: string;

  declare ram_type: string;
  declare expansion_slots: number;

  declare io_ports: {};
}

Mainboard.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    socket: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    form_factor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ram_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expansion_slots: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    io_ports: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.MAIN,
  }
);

PartInformation.hasOne(Mainboard, {
  foreignKey: "id",
});
Mainboard.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { Mainboard };
