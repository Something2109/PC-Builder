import {
  FilterOptions,
  NumberFilterOptions,
  FormFactor,
  InternalConnectors,
} from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";
import SSD from "../info/SSD";

export namespace SSDProduct {
  export const Label = "SSD";

  export const Primary = [Infos.SSD];
  export const Secondary = [];

  export const Filter = z
    .object({
      memory_type: FilterOptions(SSD.MemoryCell),
      form_factor: FilterOptions(FormFactor.SSD),
      capacity: NumberFilterOptions,
      interface: FilterOptions(InternalConnectors.Storage.SSD),
      read_speed: NumberFilterOptions,
      write_speed: NumberFilterOptions,
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: { [key in keyof Required<Filter>]: string } = {
    memory_type: "Memory Type",
    form_factor: "Form Factor",
    capacity: "Capacity",
    interface: "Interface",
    read_speed: "Read Speed",
    write_speed: "Write Speed",
  };

  export const AttributeMapping: Record<keyof Filter, [Infos, string]> = {
    memory_type: [Infos.SSD, "memory_type"],
    form_factor: [Infos.SSD, "form_factor"],
    capacity: [Infos.SSD, "capacity"],
    interface: [Infos.SSD, "interface"],
    read_speed: [Infos.SSD, "read_speed"],
    write_speed: [Infos.SSD, "write_speed"],
  };
}

export default SSDProduct;
