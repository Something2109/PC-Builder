import { PartDetailTable, PartDefaultScope, Tables } from "../../interface";
import { GPUModel } from "./GPU";
import { PartInformation } from "./Part";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import GPU from "@/utils/interface/part/GPU";
import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from "sequelize-typescript";

type APIDisplayInterface = {
  HDMI?: number;
  DisplayPort?: number;
  DVI_D?: number;
};

@DefaultScope(() => PartDefaultScope)
@Scopes(() => ({
  summary: { attributes: [...GraphicCard.SummaryAttributes] },
  filter: (options: GraphicCard.FilterOptions) => ({ where: options }),
  detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
}))
@Table({ modelName: Tables.GRAPHIC_CARD })
class GraphicCardModel
  extends Model
  implements PartDetailTable<GraphicCard.Info>
{
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.FLOAT)
  declare width: number | null;

  @Column(DataType.FLOAT)
  declare length: number | null;

  @Column(DataType.FLOAT)
  declare height: number | null;

  @Column(DataType.FLOAT)
  declare base_frequency: number | null;

  @Column(DataType.FLOAT)
  declare boost_frequency: number | null;

  @Column(DataType.INTEGER)
  declare pcie: number | null;

  @Column(DataType.INTEGER)
  declare minimum_psu: number | null;

  @Column(DataType.STRING)
  declare power_connector: string | null;

  @ForeignKey(() => GPUModel)
  @Column(DataType.UUID)
  declare gpu_id: string | null;

  @BelongsTo(() => GPUModel)
  declare gpu: GPU.Info | null;
}

export { GraphicCardModel, type APIDisplayInterface };
