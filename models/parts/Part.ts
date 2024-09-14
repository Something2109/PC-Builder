import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, Tables } from "@/models/interface";

type PartInformationType = {
  id: CreationOptional<string>;

  part: string;
  name: string;
  code_name: string;
  brand: string;
  family?: string;
  series: string;

  launch_date?: Date;
  url?: string;
  image_url?: string;
};

class PartInformation
  extends Model<
    InferAttributes<PartInformation>,
    InferCreationAttributes<PartInformation>
  >
  implements PartInformationType
{
  declare id: CreationOptional<string>;
  declare part: string;
  declare name: string;
  declare code_name: string;
  declare brand: string;
  declare family?: string;
  declare series: string;

  declare launch_date?: Date;
  declare url?: string;
  declare image_url?: string;
  declare raw?: string;
}

PartInformation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    part: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    family: {
      type: DataTypes.STRING,
    },
    series: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    launch_date: {
      type: DataTypes.DATE,
    },
    url: {
      type: DataTypes.STRING,
    },
    image_url: {
      type: DataTypes.STRING,
    },

    raw: {
      type: DataTypes.TEXT,
    },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.PART,
    defaultScope: {
      attributes: {
        exclude: ["raw", "createdAt", "updatedAt"],
      },
    },
  }
);

export { PartInformation, type PartInformationType };
