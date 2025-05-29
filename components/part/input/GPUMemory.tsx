import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { OptionSelect, SuffixInput, UnitInput } from "@/components/utils/Input";
import GPUMemory from "@/utils/interface/part/info/GPUMemory";
import { InternalConnectors } from "@/utils/interface/utils";
import {
  MemorySpeedUnit,
  MemoryUnits,
  TransferSpeedUnit,
} from "@/utils/extract/Units";

const Components: InfoComponentObject<GPUMemory.Info> = {
  type: (props) => (
    <OptionSelect options={InternalConnectors.SGRAM.options} {...props} />
  ),
  speed: (props) => (
    <UnitInput Unit={TransferSpeedUnit} defaultUnit="MT/s" {...props} />
  ),
  capacity: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  bandwidth: (props) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="GB/s" {...props} />
  ),
  bus_width: (props) => <SuffixInput suffix="bit" type="number" {...props} />,
};

function submit(formData: FormData) {
  return GPUMemory.Schema.partial().parse(defaultParse(formData))!;
}

export default GenericInputField(
  InfoComponent(Components, GPUMemory.Label),
  submit
);
