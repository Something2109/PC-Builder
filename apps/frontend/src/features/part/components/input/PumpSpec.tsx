import { ZodType } from "zod";

import { SuffixInput, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import * as PumpSpec from "@/utils/part/info/PumpSpec";
import { LengthUnits, VolumeSpeedUnit } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<PumpSpec.DTO> = {
  form_factor: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={FormFactor.Pump.options} {...props} />
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
  voltage: ({ form: _, ...props }) => (
    <SuffixInput suffix="V" type="number" step={0.01} {...props} />
  ),
  wattage: ({ form: _, ...props }) => <SuffixInput suffix="W" type="number" {...props} />,
  head_pressure: ({ form: _, ...props }) => (
    <SuffixInput suffix="m" type="number" step={0.01} {...props} />
  ),
  flow_rate: ({ form: _, ...props }) => (
    <UnitInput Unit={VolumeSpeedUnit} defaultUnit="L/h" {...props} />
  ),
  power_connector: ({ form: _, options: __, ...props }) => (
    <OptionSelect
      options={InternalConnectors.Power.Miscellanous.options}
      {...props}
    />
  ),
  control_connector: ({ form: _, options: __, ...props }) => (
    <OptionSelect
      options={InternalConnectors.Fan.Connector.options}
      {...props}
    />
  ),
  rgb: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...props} />
  ),
};

export default GenericSingleInputForm<PumpSpec.DTO>(
  Components,
  PumpSpec.Label,
  PumpSpec.Schemas.DTO as ZodType<PumpSpec.DTO, PumpSpec.DTO>
);
