import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import {
  Input,
  OptionSelect,
  SuffixInput,
  UnitInput,
} from "@/components/utils/Input";
import * as GraphicCardSpec from "@/utils/part/info/GraphicCardSpec";
import { InternalConnectors } from "@/utils/interface";
import { LengthUnits } from "@/utils/Units";

const Components: InfoComponentObject<GraphicCardSpec.DTO> = {
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
  return GraphicCardSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, GraphicCardSpec.Label),
  submit
);
