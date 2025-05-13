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
import MainboardSpec from "@/utils/interface/part/info/MainboardSpec";
import { InternalConnectors, FormFactor } from "@/utils/interface/utils";
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
  [ModelScopes.DETAIL]: {
    ...PartDefaultScope,
  },
}))
@Table({ modelName: Infos.MAIN_SPEC })
class MainboardSpecModel
  extends Model
  implements PartDetailTable<MainboardSpec.Info>
{
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Mainboard.options] },
  })
  declare form_factor: FormFactor.Mainboard | null;

  @Column(DataType.STRING)
  declare socket: string | null;

  @Column(DataType.STRING)
  declare chipset: string | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.RAM.options] },
  })
  declare ram_form_factor: FormFactor.RAM | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.RAM.options] },
  })
  declare ram_interface: InternalConnectors.RAM | null;

  @Column(DataType.TINYINT)
  declare ram_slot: number | null;

  /**
   * Declare the miscelanous connector object saving the data as a JSON string
   * in the {@link miscelanous_connectors} column.
   */

  @Column(DataType.TEXT)
  get miscelanous_connectors(): Record<string, number> | undefined {
    const data = this.getDataValue("miscelanous_connectors");

    return data ? JSON.parse(data) : undefined;
  }

  set miscelanous_connectors(value: Record<string, number> | null) {
    this.setDataValue(
      "miscelanous_connectors",
      value ? JSON.stringify(value) : null
    );
  }
}

export { MainboardSpecModel };
