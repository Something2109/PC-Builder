import { ZodType } from "zod";

import {
  Input,
  UnitInput,
  OptionSelect,
  SuffixInput,
} from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import * as FanSpec from "@/utils/part/info/FanSpec";
import { LengthUnits } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<FanSpec.DTO> = {
  form_factor: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={FormFactor.Fan.options} {...props} />
  ),
  width: ({ form: _, ...props }) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  length: ({ form: _, ...props }) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  height: ({ form: _, ...props }) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  count: ({ form: _, ...props }) => <Input type="number" {...props} />,
  voltage: ({ form: _, ...props }) => (
    <SuffixInput suffix="V" type="number" step={0.01} {...props} />
  ),
  speed: ({ form: _, ...props }) => <SuffixInput suffix="RPM" type="number" {...props} />,
  airflow: ({ form: _, ...props }) => (
    <SuffixInput suffix="CFM" type="number" step={0.01} {...props} />
  ),
  noise: ({ form: _, ...props }) => (
    <SuffixInput suffix="dBA" type="number" step={0.01} {...props} />
  ),
  static_pressure: ({ form: _, ...props }) => (
    <SuffixInput suffix="mm H₂O" type="number" step={0.01} {...props} />
  ),
  bearing: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={FanSpec.Bearing.options} {...props} />
  ),
  connector: ({ form: _, options: __, ...props }) => (
    <OptionSelect
      options={InternalConnectors.Fan.Connector.options}
      {...props}
    />
  ),
  rgb: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...props} />
  ),
};

export default GenericSingleInputForm<FanSpec.DTO>(
  Components,
  FanSpec.Label,
  FanSpec.Schemas.DTO as ZodType<FanSpec.DTO, FanSpec.DTO>
);
