import { OptionSelect, SuffixInput, UnitInput } from "@/ui/Input";
import { InternalConnectors } from "@/utils/interface";
import * as GPUMemory from "@/utils/part/info/GPUMemory";
import { MemorySpeedUnit, MemoryUnits, TransferSpeedUnit } from "@/utils/Units";

import { defaultParse, GenericInputField } from "../utils/Form";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<GPUMemory.DTO> = {
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
  return GPUMemory.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, GPUMemory.Label),
  submit
);
