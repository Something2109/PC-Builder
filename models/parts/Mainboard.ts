import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../interface";
import { PartInformation } from "./Part";
import Mainboard from "@/utils/interface/part/Mainboard";
import {
  MainboardFormFactors,
  MainboardFormFactorType,
  RAMFormFactors,
  RAMFormFactorType,
  RAMProtocols,
  RAMProtocolType,
} from "@/utils/interface/part/utils";

class MainboardModel
  extends Model<
    InferAttributes<MainboardModel>,
    InferCreationAttributes<MainboardModel>
  >
  implements PartDetailTable<Mainboard.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;

  declare form_factor: MainboardFormFactorType | null;
  declare socket: string | null;

  declare ram_form_factor: RAMFormFactorType | null;
  declare ram_protocol: RAMProtocolType | null;
  declare ram_slot: number | null;

  declare expansion_slots: number | null;
  declare io_ports: {} | null;
}

MainboardModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    socket: {
      type: DataTypes.STRING,
    },
    form_factor: {
      type: DataTypes.STRING,
      validate: { isIn: [MainboardFormFactors] },
    },

    ram_form_factor: {
      type: DataTypes.STRING,
      validate: { isIn: [RAMFormFactors] },
    },
    ram_protocol: {
      type: DataTypes.STRING,
      validate: { isIn: [RAMProtocols] },
    },
    ram_slot: { type: DataTypes.TINYINT },

    expansion_slots: { type: DataTypes.TINYINT },
    io_ports: { type: DataTypes.STRING },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.MAIN,
  }
);

PartInformation.hasOne(MainboardModel, {
  foreignKey: "id",
});
MainboardModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { MainboardModel as Mainboard };
