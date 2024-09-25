import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Op,
  WhereOptions,
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
      filter(options: PartType.FilterOptions) {
        let where: WhereOptions<InferAttributes<PartInformation>> = {};

        Object.entries(options).forEach(([key, arr]) => {
          if (filter[key as PartType.Filterables]) {
            where = {
              ...where,
              ...filter[key as PartType.Filterables](arr as any),
            };
          }
        });

        return { where };
      },
      detail: {
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
    },
  }
);

const filter: {
  [key in PartType.Filterables]: (
    filter: Required<PartType.FilterOptions>[key]
  ) => WhereOptions<InferAttributes<PartInformation>>;
} = {
  part: (filter: string[]) => ({
    part: {
      [Op.in]: filter,
    },
  }),
  brand: (filter) => ({
    brand: {
      [Op.in]: filter,
    },
  }),
  series: (filter: string[]) => ({
    series: {
      [Op.in]: filter,
    },
  }),
};

export { PartInformation };
