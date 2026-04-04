import { RowWrapper } from "@/ui/FlexWrapper";
import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import {
  SuffixInput,
  UnitInput,
  OptionSelect,
  Input,
} from "@/ui/Input";
import * as RAMSpec from "@/utils/part/info/RAMSpec";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import { MemoryUnits, TransferSpeedUnit } from "@/utils/Units";

const Components: InfoComponentObject<RAMSpec.DTO> = {
  speed: (props) => (
    <UnitInput Unit={TransferSpeedUnit} defaultUnit="MT/s" {...props} />
  ),
  capacity: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  voltage: (props) => (
    <SuffixInput suffix="V" type="number" step={0.01} {...props} />
  ),
  latency: ({ defaultValue, value: _, ...props }) => (
    <RowWrapper>
      <Input
        {...props}
        type="number"
        className="w-1/5"
        defaultValue={defaultValue ? defaultValue[0] : ""}
      ></Input>
      {" - "}
      <Input
        {...props}
        type="number"
        className="w-1/5"
        defaultValue={defaultValue ? defaultValue[1] : ""}
      ></Input>
      {" - "}
      <Input
        {...props}
        type="number"
        className="w-1/5"
        defaultValue={defaultValue ? defaultValue[2] : ""}
      ></Input>
      {" - "}
      <Input
        {...props}
        type="number"
        className="w-1/5"
        defaultValue={defaultValue ? defaultValue[3] : ""}
      ></Input>
    </RowWrapper>
  ),
  kit: (props) => (
    <SuffixInput suffix="stick(s)" type="number" step={0.01} {...props} />
  ),
  form_factor: (props) => (
    <OptionSelect options={FormFactor.RAM.options} {...props} />
  ),
  interface: (props) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...props} />
  ),
};

function submit(formData: FormData) {
  const raw = defaultParse(formData);

  raw.latency = formData
    .getAll("latency")
    .filter((v) => Number(v) > 0) as string[];

  return RAMSpec.Schemas.DTO.parse(raw);
}

export default GenericInputField(
  InfoComponent(Components, RAMSpec.Label),
  submit
);
