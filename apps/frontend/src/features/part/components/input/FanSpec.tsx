import { FormFactor, InternalConnectors } from "@pc-builder/shared/interface";
import * as FanSpec from "@pc-builder/shared/part/info/FanSpec";
import { LengthUnits } from "@pc-builder/shared/Units";
import { ZodType } from "zod";

import { Input, UnitInput, OptionSelect, SuffixInput } from "@/ui/Input";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<FanSpec.DTO> = {
  form_factor: (field) => (
    <OptionSelect options={FormFactor.Fan.options} {...mapChange(field, "select")} />
  ),
  width: (field) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...mapChange(field, "number")} />
  ),
  length: (field) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...mapChange(field, "number")} />
  ),
  height: (field) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...mapChange(field, "number")} />
  ),
  count: (field) => <Input type="number" {...mapChange(field, "number")} />,
  voltage: (field) => (
    <SuffixInput suffix="V" type="number" step={0.01} {...mapChange(field, "number")} />
  ),
  speed: (field) => <SuffixInput suffix="RPM" type="number" {...mapChange(field, "number")} />,
  airflow: (field) => (
    <SuffixInput suffix="CFM" type="number" step={0.01} {...mapChange(field, "number")} />
  ),
  noise: (field) => (
    <SuffixInput suffix="dBA" type="number" step={0.01} {...mapChange(field, "number")} />
  ),
  static_pressure: (field) => (
    <SuffixInput suffix="mm H₂O" type="number" step={0.01} {...mapChange(field, "number")} />
  ),
  bearing: (field) => (
    <OptionSelect options={FanSpec.Bearing.options} {...mapChange(field, "select")} />
  ),
  connector: (field) => (
    <OptionSelect
      options={InternalConnectors.Fan.Connector.options}
      {...mapChange(field, "select")}
    />
  ),
  rgb: (field) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...mapChange(field, "select")} />
  ),
};

export default GenericSingleInputForm<FanSpec.DTO>(
  Components,
  FanSpec.Label,
  FanSpec.Schemas.DTO as ZodType<FanSpec.DTO, FanSpec.DTO>
);
