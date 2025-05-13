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
import GraphicCardSpec from "@/utils/interface/part/info/GraphicCardSpec";
import { PowerConnectorExchanger } from "@/utils/extract/Connector";
import { Infos } from "@/utils/Enum";
import { PartInformation } from "..";
import {
  PartDetailTable,
  PartDefaultScope,
  ModelScopes,
  defaultFilter,
} from "../../interface";

@Scopes(() => ({
  [ModelScopes.SUMMARY]: (attributes?: string[]) => ({
    attributes: attributes?.length ? ["id", ...attributes] : [],
  }),
  [ModelScopes.FILTER]: (options?: Record<string, string[] | number[]>) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Infos.GRAPHIC_CARD_SPEC })
class GraphicCardSpecModel
  extends Model
  implements PartDetailTable<GraphicCardSpec.Info>
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

  @Column(DataType.INTEGER)
  declare pcie: number | null;

  @Column(DataType.INTEGER)
  declare minimum_psu: number | null;

  @Column(DataType.TINYINT)
  get power_connector(): GraphicCardSpec.PowerConnectorType | undefined {
    let pcie: number = this.getDataValue("power_connector");

    return PowerConnectorExchanger.toObject({ pcie }) ?? undefined;
  }

  set power_connector(value: GraphicCardSpec.PowerConnectorType | null) {
    const { pcie } = PowerConnectorExchanger.toNumber(value);

    this.setDataValue("power_connector", pcie);
  }
}

export { GraphicCardSpecModel };
