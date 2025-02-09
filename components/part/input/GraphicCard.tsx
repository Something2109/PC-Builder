import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, SuffixInput, UnitInput } from "@/components/utils/Input";
import GraphicCard from "@/utils/interface/info/GraphicCard";
import { FrequencyUnits, LengthUnits } from "@/utils/extract/Units";

const Components: InfoInputMapping<GraphicCard.Info> = {
  width: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  length: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  height: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  base_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="MHz" {...props} />
  ),
  boost_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="MHz" {...props} />
  ),
  pcie: (props) => <Input type="number" {...props} />,
  minimum_psu: (props) => <SuffixInput suffix="W" type="number" {...props} />,
  power_connector: (props) => <></>,
  port: (props) => <></>,
  gpu: (props) => <></>,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return GraphicCard.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, GraphicCard.Label, submit);
