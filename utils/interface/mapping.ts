import { z } from "zod";
import { Product } from "./product";
import { Infos, Products } from "../Enum";

/**
 * DECLARE THE PRODUCT RELATED MAPPING AND FILTER.
 */
export namespace Mapping {
  /**
   * The mapping from the {@link Products} to the {@link Info} type.
   * Contains all the {@link Info} that a {@link Products} type can have.
   */
  export const Info: { [key in Products]: Infos[] } = {
    [Products.CPU]: [Infos.CPU, Infos.GPU],
    [Products.GPU]: [Infos.GPU],
    [Products.GRAPHIC_CARD]: [Infos.GRAPHIC_CARD],
    [Products.MAIN]: [Infos.MAIN],
    [Products.RAM]: [Infos.RAM],
    [Products.SSD]: [Infos.SSD],
    [Products.HDD]: [Infos.HDD],
    [Products.PSU]: [Infos.PSU],
    [Products.CASE]: [Infos.CASE],
    [Products.COOLER]: [Infos.CPU_BLOCK, Infos.FAN, Infos.RADIATOR],
    [Products.AIO]: [Infos.CPU_BLOCK, Infos.FAN, Infos.PUMP, Infos.RADIATOR],
    [Products.FAN]: [Infos.FAN],
    [Products.CPU_BLOCK]: [Infos.CPU_BLOCK],
    [Products.PUMP]: [Infos.PUMP],
    [Products.RADIATOR]: [Infos.RADIATOR],
  };

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
      socket: [Infos.CPU, "socket"],
      total_cores: [Infos.CPU, "total_cores"],
      total_threads: [Infos.CPU, "total_threads"],
      base_frequency: [Infos.CPU, "base_frequency"],
      turbo_frequency: [Infos.CPU, "turbo_frequency"],
      L3_cache: [Infos.CPU, "L3_cache"],
      tdp: [Infos.CPU, "tdp"],
    },
    [Products.GPU]: {
      core_count: [Infos.GPU, "core_count"],
      base_frequency: [Infos.GPU, "base_frequency"],
      boost_frequency: [Infos.GPU, "boost_frequency"],
      memory_size: [Infos.GPU, "memory_size"],
      memory_type: [Infos.GPU, "memory_type"],
      tdp: [Infos.GPU, "tdp"],
    },
    [Products.GRAPHIC_CARD]: {
      length: [Infos.GRAPHIC_CARD, "length"],
      base_frequency: [Infos.GRAPHIC_CARD, "base_frequency"],
      boost_frequency: [Infos.GRAPHIC_CARD, "boost_frequency"],
      width: [Infos.GRAPHIC_CARD, "width"],
      height: [Infos.GRAPHIC_CARD, "height"],
      minimum_psu: [Infos.GRAPHIC_CARD, "minimum_psu"],
    },
    [Products.MAIN]: {
      socket: [Infos.MAIN, "socket"],
      form_factor: [Infos.MAIN, "form_factor"],
      ram_form_factor: [Infos.MAIN, "ram_form_factor"],
      ram_interface: [Infos.MAIN, "ram_interface"],
    },
    [Products.RAM]: {
      speed: [Infos.RAM, "speed"],
      form_factor: [Infos.RAM, "form_factor"],
      capacity: [Infos.RAM, "capacity"],
      interface: [Infos.RAM, "interface"],
    },
    [Products.SSD]: {
      memory_type: [Infos.SSD, "memory_type"],
      form_factor: [Infos.SSD, "form_factor"],
      capacity: [Infos.SSD, "capacity"],
      interface: [Infos.SSD, "interface"],
      read_speed: [Infos.SSD, "read_speed"],
      write_speed: [Infos.SSD, "write_speed"],
    },
    [Products.HDD]: {
      form_factor: [Infos.HDD, "form_factor"],
      capacity: [Infos.HDD, "capacity"],
      interface: [Infos.HDD, "interface"],
      read_speed: [Infos.HDD, "read_speed"],
      write_speed: [Infos.HDD, "write_speed"],
      rotational_speed: [Infos.HDD, "rotational_speed"],
    },
    [Products.PSU]: {
      form_factor: [Infos.PSU, "form_factor"],
      wattage: [Infos.PSU, "wattage"],
      efficiency: [Infos.PSU, "efficiency"],
      modular: [Infos.PSU, "modular"],
    },
    [Products.CASE]: {
      form_factor: [Infos.CASE, "form_factor"],
      mainboard_support: [Infos.CASE, "mainboard_support"],
      radiator_support: [Infos.CASE, "radiator_support"],
      psu_support: [Infos.CASE, "psu_support"],
    },
    [Products.COOLER]: {
      socket: [Infos.CPU_BLOCK, "socket"],
      cpu_plate: [Infos.CPU_BLOCK, "plate"],
      height: [Infos.RADIATOR, "height"],
    },
    [Products.AIO]: {
      socket: [Infos.CPU_BLOCK, "socket"],
      form_factor: [Infos.RADIATOR, "form_factor"],
      cpu_plate: [Infos.CPU_BLOCK, "plate"],
    },
    [Products.FAN]: {
      form_factor: [Infos.FAN, "form_factor"],
      bearing: [Infos.FAN, "bearing"],
      speed: [Infos.FAN, "speed"],
    },
    [Products.CPU_BLOCK]: {
      socket: [Infos.CPU_BLOCK, "socket"],
      plate: [Infos.CPU_BLOCK, "plate"],
    },
    [Products.PUMP]: {
      form_factor: [Infos.PUMP, "form_factor"],
      head_pressure: [Infos.PUMP, "head_pressure"],
      flow_rate: [Infos.PUMP, "flow_rate"],
      power_connector: [Infos.PUMP, "power_connector"],
      control_connector: [Infos.PUMP, "control_connector"],
    },
    [Products.RADIATOR]: {
      form_factor: [Infos.RADIATOR, "form_factor"],
      material: [Infos.RADIATOR, "material"],
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
