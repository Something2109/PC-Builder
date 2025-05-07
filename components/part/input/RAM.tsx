import { RowWrapper } from "@/components/utils/FlexWrapper";
import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import {
  SuffixInput,
  UnitInput,
  OptionSelect,
  Input,
} from "@/components/utils/Input";
import { MemoryUnits, TransferSpeedUnit } from "@/utils/extract/Units";
import RAM from "@/utils/interface/part/info/RAM";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

const Components: InfoComponentObject<RAM.Info> = {
  speed: (props) => (
    <UnitInput Unit={TransferSpeedUnit} defaultUnit="mm" {...props} />
  ),
  capacity: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  voltage: (props) => (
    <SuffixInput suffix="V" type="number" step={0.01} {...props} />
  ),
  latency: ({ defaultValue, value, ...props }) => (
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
  const raw = Object.fromEntries(
    formData
      .entries()
      .map(([key, value]) => [
        key,
        value === "" || Number(value) === 0 ? undefined : value,
      ])
  ) as Record<string, string | string[]>;

  raw.latency = formData
    .getAll("latency")
    .filter((v) => Number(v) > 0) as string[];

  return RAM.Schema.parse(raw)!;
}

export default GenericInputField(InfoComponent(Components, RAM.Label), submit);
