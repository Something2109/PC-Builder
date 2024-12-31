import { PartDetailTable, PartDefaultScope, Tables } from "../../interface";
import { GPUModel } from "./GPU";
import { PartInformation } from "./Part";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import GPU from "@/utils/interface/part/GPU";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from "sequelize-typescript";
import { PowerConnectorExchanger } from "@/utils/extract/Connector";

type APIDisplayInterface = {
  HDMI?: number;
  DisplayPort?: number;
  DVI_D?: number;
};

@Scopes(() => ({
  summary: { attributes: ["id", ...GraphicCard.SummaryAttributes] },
  filter: (options: GraphicCard.FilterOptions) => ({ where: options }),
  detail: PartDefaultScope,
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

  @Column(DataType.TINYINT)
  get power_connector(): GraphicCard.PowerConnectorType | null {
    let pcie: number = this.getDataValue("power_connector");

    return PowerConnectorExchanger.toObject({ pcie });
  }

  set power_connector(value: GraphicCard.PowerConnectorType | null) {
    const { pcie } = PowerConnectorExchanger.toNumber(value);

    this.setDataValue("power_connector", pcie);
  }

  @Column(DataType.TEXT)
  get port(): GraphicCard.PortType | null {
    let data: string = this.getDataValue("port");

    return data ? JSON.parse(data) : null;
  }

  set port(value: GraphicCard.PortType | null) {
    this.setDataValue("port", value ? JSON.stringify(value) : null);
  }

  @ForeignKey(() => GPUModel)
  @Column(DataType.UUID)
  declare gpu_id: string | null;

  @BelongsTo(() => GPUModel)
  declare gpu: GPU.Info | null;
}

export { GraphicCardModel, type APIDisplayInterface };
