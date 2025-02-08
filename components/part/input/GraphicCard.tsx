import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input } from "@/components/utils/Input";
import GraphicCard from "@/utils/interface/info/GraphicCard";

const Components: InfoInputMapping<GraphicCard.Info> = {
  width: (props) => <Input type="number" step="0.01" {...props} />,
  length: (props) => <Input type="number" step="0.01" {...props} />,
  height: (props) => <Input type="number" step="0.01" {...props} />,
  base_frequency: (props) => <Input type="number" {...props} />,
  boost_frequency: (props) => <Input type="number" {...props} />,
  pcie: (props) => <Input type="number" {...props} />,
  minimum_psu: (props) => <Input type="number" {...props} />,
  power_connector: (props) => <></>,
  port: (props) => <></>,
  gpu: (props) => <></>,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return GraphicCard.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, GraphicCard.Label, submit);
