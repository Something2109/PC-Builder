import { ZodType } from "zod";

import { SuffixInput, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import * as PumpSpec from "@/utils/part/info/PumpSpec";
import { LengthUnits, VolumeSpeedUnit } from "@/utils/Units";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<PumpSpec.DTO> = {
  form_factor: (field) => (
    <OptionSelect
      options={FormFactor.Pump.options}
      {...mapChange(field, "select")}
    />
  ),
  width: (field) => (
    <UnitInput
      Unit={LengthUnits}
      defaultUnit="mm"
      {...mapChange(field, "number")}
    />
  ),
  length: (field) => (
    <UnitInput
      Unit={LengthUnits}
      defaultUnit="mm"
      {...mapChange(field, "number")}
    />
  ),
  height: (field) => (
    <UnitInput
      Unit={LengthUnits}
      defaultUnit="mm"
      {...mapChange(field, "number")}
    />
  ),
  voltage: (field) => (
    <SuffixInput
      suffix="V"
      type="number"
      step={0.01}
      {...mapChange(field, "number")}
    />
  ),
  wattage: (field) => (
    <SuffixInput
      suffix="W"
      type="number"
      {...mapChange(field, "number")}
    />
  ),
  head_pressure: (field) => (
    <SuffixInput
      suffix="m"
      type="number"
      step={0.01}
      {...mapChange(field, "number")}
    />
  ),
  flow_rate: (field) => (
    <UnitInput
      Unit={VolumeSpeedUnit}
      defaultUnit="L/h"
      {...mapChange(field, "number")}
    />
  ),
  power_connector: (field) => (
    <OptionSelect
      options={InternalConnectors.Power.Miscellanous.options}
      {...mapChange(field, "select")}
    />
  ),
  control_connector: (field) => (
    <OptionSelect
      options={InternalConnectors.Fan.Connector.options}
      {...mapChange(field, "select")}
    />
  ),
  rgb: (field) => (
    <OptionSelect
      options={InternalConnectors.RGB.options}
      {...mapChange(field, "select")}
    />
  ),
};

export default GenericSingleInputForm<PumpSpec.DTO>(
  Components,
  PumpSpec.Label,
  PumpSpec.Schemas.DTO as ZodType<PumpSpec.DTO, PumpSpec.DTO>
);
