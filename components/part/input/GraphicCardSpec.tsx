import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import {
  Input,
  OptionSelect,
  SuffixInput,
  UnitInput,
} from "@/components/utils/Input";
import GraphicCardSpec from "@/utils/interface/part/info/GraphicCardSpec";
import { InternalConnectors } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<GraphicCardSpec.Info> = {
  width: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  length: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  height: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  pcie: (props) => <Input type="number" {...props} />,
  minimum_psu: (props) => <SuffixInput suffix="W" type="number" {...props} />,
  power_connector: (props) => (
    <OptionSelect
      options={InternalConnectors.Power.GraphicCard.options}
      {...props}
    />
  ),
  power_connector_count: (props) => <Input type="number" {...props} />,
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

  return GraphicCardSpec.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, GraphicCardSpec.Label),
  submit
);
