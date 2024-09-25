import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, Tables } from "@/models/interface";
import { PartType } from "@/utils/interface/Parts";

class PartInformation
  extends Model<
    InferAttributes<PartInformation>,
    InferCreationAttributes<PartInformation>
  >
  implements PartType.BasicInfo
{
  declare id: CreationOptional<string>;

  declare part: string;
  declare name: string;
  declare code_name: string;
  declare brand: string;
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

    part: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    code_name: { type: DataTypes.STRING, unique: true },
    brand: { type: DataTypes.STRING },
    series: { type: DataTypes.STRING },

    launch_date: { type: DataTypes.DATE },
    url: { type: DataTypes.STRING, validate: { isUrl: true } },
    image_url: { type: DataTypes.STRING, validate: { isUrl: true } },

    raw: { type: DataTypes.TEXT },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.PART,
    defaultScope: {
      attributes: {
        exclude: ["raw", "createdAt", "updatedAt"],
      },
    },
    scopes: {
      filter: (options: PartType.FilterOptions) => ({
        where: options,
      }),
      detail: {
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
    },
  }
);

export { PartInformation };
