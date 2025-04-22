import { z } from "zod";
import { Product } from "./product";
import { Infos, Products } from "../../Enum";

/**
 * DECLARE THE PRODUCT RELATED MAPPING AND FILTER.
 */
export namespace Mapping {
  /**
   * The mapping from the {@link Products} to the {@link Info} type.
   * Contains all the {@link Info} that a {@link Products} type can have.
   */
  export const Info = {
    [Products.CPU]: [
      Infos.CPU_SPEC,
      Infos.CPU_PERF,
      Infos.CPU_CORES,
      Infos.PROCESSOR_CACHE,
      Infos.PROCESSOR_MEMORY,
      Infos.GPU_SPEC,
      Infos.GPU_PERF,
    ],
    [Products.GPU]: [
      Infos.GPU_SPEC,
      Infos.GPU_PERF,
      Infos.GPU_FEAT,
      Infos.PROCESSOR_CACHE,
      Infos.PROCESSOR_MEMORY,
    ],
    [Products.GRAPHIC_CARD]: [Infos.GRAPHIC_CARD_SPEC, Infos.GPU_PERF],
    [Products.MAIN]: [
      Infos.MAIN_SPEC,
      Infos.MAIN_PCIE,
      Infos.MAIN_STORAGE,
      Infos.MAIN_USB,
    ],
    [Products.RAM]: [Infos.RAM_SPEC],
    [Products.SSD]: [Infos.SSD_SPEC, Infos.STORAGE_PERF, Infos.STORAGE_CACHE],
    [Products.HDD]: [Infos.HDD_SPEC, Infos.STORAGE_PERF, Infos.STORAGE_CACHE],
    [Products.PSU]: [Infos.PSU_SPEC],
    [Products.CASE]: [
      Infos.CASE_SPEC,
      Infos.CASE_MAIN,
      Infos.CASE_FAN,
      Infos.CASE_HARD_DRIVE,
      Infos.CASE_RADIATOR,
      Infos.CASE_PSU,
    ],
    [Products.COOLER]: [
      Infos.CPU_BLOCK_SPEC,
      Infos.CPU_BLOCK_SOCKET,
      Infos.FAN_SPEC,
      Infos.RADIATOR_SPEC,
    ],
    [Products.AIO]: [
      Infos.CPU_BLOCK_SPEC,
      Infos.CPU_BLOCK_SOCKET,
      Infos.FAN_SPEC,
      Infos.PUMP_SPEC,
      Infos.RADIATOR_SPEC,
    ],
    [Products.FAN]: [Infos.FAN_SPEC],
    [Products.CPU_BLOCK]: [Infos.CPU_BLOCK_SPEC, Infos.CPU_BLOCK_SOCKET],
    [Products.PUMP]: [Infos.PUMP_SPEC],
    [Products.RADIATOR]: [Infos.RADIATOR_SPEC],
  } as const;

  /**
   * The attribute mapping from the {@link Product} namespace
   * to the {@link Info} namespace.
   * Each {@link Product} attribute is mapped by an tuple
   * of {@link Infos} and the attribute key corresponding
   * to the {@link Info} namespace.
   */
  export const AttributeMapping: {
    [key in Products]: Record<
      keyof z.infer<
        (typeof Product.FilterOptions | typeof Product.Summary)[key]
      >,
      [(typeof Info)[key][number], string]
    >;
  } = {
    [Products.CPU]: {
      socket: [Infos.CPU_SPEC, "socket"],
      total_cores: [Infos.CPU_SPEC, "total_cores"],
      total_threads: [Infos.CPU_SPEC, "total_threads"],
      L3_cache: [Infos.PROCESSOR_CACHE, "L3_cache"],
      base_frequency: [Infos.CPU_PERF, "base_frequency"],
      turbo_frequency: [Infos.CPU_PERF, "boost_frequency"],
      tdp: [Infos.CPU_PERF, "tdp"],
    },
    [Products.GPU]: {
      core_count: [Infos.GPU_SPEC, "core_count"],
      base_frequency: [Infos.GPU_PERF, "base_frequency"],
      boost_frequency: [Infos.GPU_PERF, "boost_frequency"],
      tdp: [Infos.GPU_PERF, "tdp"],
      memory_size: [Infos.PROCESSOR_MEMORY, "memory_size"],
      memory_type: [Infos.PROCESSOR_MEMORY, "memory_type"],
    },
    [Products.GRAPHIC_CARD]: {
      width: [Infos.GRAPHIC_CARD_SPEC, "width"],
      height: [Infos.GRAPHIC_CARD_SPEC, "height"],
      length: [Infos.GRAPHIC_CARD_SPEC, "length"],
      base_frequency: [Infos.GPU_PERF, "base_frequency"],
      boost_frequency: [Infos.GPU_PERF, "boost_frequency"],
      minimum_psu: [Infos.GPU_PERF, "minimum_psu"],
    },
    [Products.MAIN]: {
      socket: [Infos.MAIN_SPEC, "socket"],
      form_factor: [Infos.MAIN_SPEC, "form_factor"],
      ram_form_factor: [Infos.MAIN_SPEC, "ram_form_factor"],
      ram_interface: [Infos.MAIN_SPEC, "ram_interface"],
    },
    [Products.RAM]: {
      speed: [Infos.RAM_SPEC, "speed"],
      form_factor: [Infos.RAM_SPEC, "form_factor"],
      capacity: [Infos.RAM_SPEC, "capacity"],
      interface: [Infos.RAM_SPEC, "interface"],
    },
    [Products.SSD]: {
      memory_type: [Infos.SSD_SPEC, "memory_type"],
      capacity: [Infos.SSD_SPEC, "capacity"],
      form_factor: [Infos.SSD_SPEC, "form_factor"],
      interface: [Infos.SSD_SPEC, "interface"],
      read_speed: [Infos.STORAGE_PERF, "read_speed"],
      write_speed: [Infos.STORAGE_PERF, "write_speed"],
    },
    [Products.HDD]: {
      form_factor: [Infos.HDD_SPEC, "form_factor"],
      capacity: [Infos.HDD_SPEC, "capacity"],
      interface: [Infos.HDD_SPEC, "interface"],
      rotational_speed: [Infos.HDD_SPEC, "rotational_speed"],
      read_speed: [Infos.STORAGE_PERF, "read_speed"],
      write_speed: [Infos.STORAGE_PERF, "write_speed"],
    },
    [Products.PSU]: {
      form_factor: [Infos.PSU_SPEC, "form_factor"],
      wattage: [Infos.PSU_SPEC, "wattage"],
      efficiency: [Infos.PSU_SPEC, "efficiency"],
      modular: [Infos.PSU_SPEC, "modular"],
    },
    [Products.CASE]: {
      form_factor: [Infos.CASE_SPEC, "form_factor"],
      mainboard_support: [Infos.CASE_MAIN, "mainboard_support"],
      radiator_support: [Infos.CASE_RADIATOR, "radiator_support"],
      psu_support: [Infos.CASE_PSU, "psu_support"],
    },
    [Products.COOLER]: {
      socket: [Infos.CPU_BLOCK_SOCKET, "socket"],
      cpu_plate: [Infos.CPU_BLOCK_SPEC, "plate"],
      height: [Infos.RADIATOR_SPEC, "height"],
    },
    [Products.AIO]: {
      socket: [Infos.CPU_BLOCK_SOCKET, "socket"],
      form_factor: [Infos.RADIATOR_SPEC, "form_factor"],
      cpu_plate: [Infos.CPU_BLOCK_SPEC, "plate"],
    },
    [Products.FAN]: {
      form_factor: [Infos.FAN_SPEC, "form_factor"],
      bearing: [Infos.FAN_SPEC, "bearing"],
      speed: [Infos.FAN_SPEC, "speed"],
    },
    [Products.CPU_BLOCK]: {
      socket: [Infos.CPU_BLOCK_SOCKET, "socket"],
      plate: [Infos.CPU_BLOCK_SPEC, "plate"],
    },
    [Products.PUMP]: {
      form_factor: [Infos.PUMP_SPEC, "form_factor"],
      head_pressure: [Infos.PUMP_SPEC, "head_pressure"],
      flow_rate: [Infos.PUMP_SPEC, "flow_rate"],
      power_connector: [Infos.PUMP_SPEC, "power_connector"],
      control_connector: [Infos.PUMP_SPEC, "control_connector"],
    },
    [Products.RADIATOR]: {
      form_factor: [Infos.RADIATOR_SPEC, "form_factor"],
      material: [Infos.RADIATOR_SPEC, "material"],
    },
  };

  /**
   * The summary attribute mapping from the {@link Products} to the {@link Infos} type.
   * Contains all the summary attributes of each {@link Infos} type that a {@link Products} type can have.
   */
  export const SummaryAttributeMapping = Object.values(Products).reduce(
    (mapping, key) => {
      const product = key as Products;
      const productAttrs = Product.Summary[product].keyof().options;

      mapping[key] = productAttrs.reduce((productMapping, attr) => {
        const [info, key] = AttributeMapping[product][attr];

        if (!productMapping[info]) productMapping[info] = [];

        productMapping[info].push(key);
        return productMapping;
      }, {} as { [key in Infos]?: string[] });
      return mapping;
    },
    {} as { [key in Products]: { [key in Infos]?: string[] } }
  );
}
