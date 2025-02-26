import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import {
  Input,
  UnitInput,
  OptionSelect,
  ChoiceInput,
} from "@/components/utils/Input";
import Case from "@/utils/interface/info/Case";
import { FormFactor } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";
import { ResponsiveWrapper } from "@/components/utils/FlexWrapper";
import { DetailInfo } from "@/utils/interface";
import { Infos } from "@/utils/Enum";

const Schema = DetailInfo.shape[Infos.CASE];

const Components: InfoInputMapping<Case.Info> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Case.options} {...props} />
  ),
  width: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  length: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  height: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  mainboard_support: ({ defaultValue, ...props }) => (
    <ResponsiveWrapper className="flex-wrap gap-x-3 justify-between">
      {FormFactor.Mainboard.options.map((val) => (
        <ChoiceInput
          {...props}
          type="checkbox"
          key={val}
          value={val}
          defaultChecked={defaultValue?.includes(val)}
        />
      ))}
    </ResponsiveWrapper>
  ),
  expansion_slot: (props) => <Input type="number" {...props} />,
  max_cooler_height: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  radiator_support: (props) => <></>,
  fan_support: (props) => <></>,
  hard_drive_support: (props) => <></>,
  psu_support: ({ defaultValue, ...props }) => (
    <ResponsiveWrapper className="flex-wrap gap-x-3 justify-between">
      {FormFactor.PSU.options.map((val) => (
        <ChoiceInput
          {...props}
          type="checkbox"
          key={val}
          value={val}
          defaultChecked={defaultValue?.includes(val)}
        />
      ))}
    </ResponsiveWrapper>
  ),
  max_psu_length: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  front_panel_ports: (props) => <></>,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(
    formData
      .entries()
      .map(([key, value]) => [
        key,
        value === "" || Number(value) === 0 ? undefined : value,
      ])
  ) as Record<string, string | string[]>;

  raw.mainboard_support = formData.getAll("mainboard_support") as string[];
  raw.psu_support = formData.getAll("psu_support") as string[];

  return Schema.parse(raw)!;
}
export default GenericInputTable(Components, Case.Label, submit);
