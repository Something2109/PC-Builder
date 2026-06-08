import { ZodType } from "zod";

import {
  Input,
  OptionSelect,
  SuffixInput,
  UnitInput,
} from "@/ui/Input";
import { InternalConnectors } from "@/utils/interface";
import * as GraphicCardSpec from "@/utils/part/info/GraphicCardSpec";
import { LengthUnits } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<GraphicCardSpec.DTO> = {
  width: ({ form: _, ...props }) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  length: ({ form: _, ...props }) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  height: ({ form: _, ...props }) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  pcie: ({ form: _, ...props }) => <Input type="number" {...props} />,
  minimum_psu: ({ form: _, ...props }) => <SuffixInput suffix="W" type="number" {...props} />,
  power_connector: ({ form: _, options: __, ...props }) => (
    <OptionSelect
      options={InternalConnectors.Power.GraphicCard.options}
      {...props}
    />
  ),
  power_connector_count: ({ form: _, ...props }) => <Input type="number" {...props} />,
};

export default GenericSingleInputForm<GraphicCardSpec.DTO>(
  Components,
  GraphicCardSpec.Label,
  GraphicCardSpec.Schemas.DTO as ZodType<GraphicCardSpec.DTO, GraphicCardSpec.DTO>
);
