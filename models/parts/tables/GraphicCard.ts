import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../../interface";
import { GPUModel } from "./GPU";
import { PartInformation } from "./Part";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import GPU from "@/utils/interface/part/GPU";

type APIDisplayInterface = {
  HDMI?: number;
  DisplayPort?: number;
  DVI_D?: number;
};

class GraphicCardModel
  extends Model<
    InferAttributes<GraphicCardModel>,
    InferCreationAttributes<GraphicCardModel>
  >
  implements PartDetailTable<GraphicCard.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;

  declare width: number | null;
  declare length: number | null;
  declare height: number | null;

  declare base_frequency: number | null;
  declare boost_frequency: number | null;

  declare pcie: number | null;
  declare minimum_psu: number | null;
  declare power_connector: string | null;

  declare gpu: NonAttribute<GPU.Info>;
  declare gpu_id: ForeignKey<GPUModel["id"]>;
}

GraphicCardModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    width: { type: DataTypes.FLOAT },
    length: { type: DataTypes.FLOAT },
    height: { type: DataTypes.FLOAT },

    base_frequency: { type: DataTypes.INTEGER },
    boost_frequency: { type: DataTypes.INTEGER },

    pcie: { type: DataTypes.INTEGER },
    minimum_psu: { type: DataTypes.INTEGER },
    power_connector: { type: DataTypes.STRING },

    gpu_id: { type: DataTypes.UUID, get: () => undefined },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.GRAPHIC_CARD,
    scopes: {
      summary: { attributes: [...GraphicCard.SummaryAttributes] },
      filter: (options: GraphicCard.FilterOptions) => ({ where: options }),
      detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
    },
  }
);

PartInformation.hasOne(GraphicCardModel, {
  foreignKey: "id",
});
GraphicCardModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

GPUModel.hasMany(GraphicCardModel, {
  foreignKey: "gpu_id",
});
GraphicCardModel.belongsTo(GPUModel, {
  foreignKey: "gpu_id",
});

export { GraphicCardModel, type APIDisplayInterface };
