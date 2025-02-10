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
}

export default SSDProduct;
