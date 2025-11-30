import * as Information from "./info";
import * as Product from "./product";
import { Infos, Products } from "../Enum";

/**
 * The mapping from the {@link Products} to the {@link Info} type.
 * Contains all the {@link Info} that a {@link Products} type can have.
 */
export const Info = {
  [Products.CPU]: [
    Infos.CPU_SPEC,
    Infos.CPU_PERF,
    Infos.CPU_CORES,
    Infos.CPU_MEMORY,
    Infos.PROCESSOR_CACHE,
    Infos.GPU_SPEC,
    Infos.GPU_PERF,
    Infos.GPU_FEAT,
  ],
  [Products.GPU]: [
    Infos.GPU_SPEC,
    Infos.GPU_PERF,
    Infos.GPU_MEMORY,
    Infos.GPU_FEAT,
    Infos.PROCESSOR_CACHE,
  ],
  [Products.GRAPHIC_CARD]: [
    Infos.GRAPHIC_CARD_SPEC,
    Infos.GPU_MEMORY,
    Infos.GPU_PERF,
    Infos.GRAPHIC_CARD_PORT,
  ],
  [Products.MAIN]: [
    Infos.MAIN_SPEC,
    Infos.MAIN_POWER,
    Infos.MAIN_PCIE,
    Infos.MAIN_STORAGE,
    Infos.MAIN_USB,
    Infos.MAIN_FAN,
    Infos.EXTERNAL_PORTS,
  ],
  [Products.RAM]: [Infos.RAM_SPEC],
  [Products.SSD]: [Infos.SSD_SPEC, Infos.STORAGE_PERF, Infos.STORAGE_CACHE],
  [Products.HDD]: [Infos.HDD_SPEC, Infos.STORAGE_PERF, Infos.STORAGE_CACHE],
  [Products.PSU]: [Infos.PSU_SPEC, Infos.PSU_CONNECTOR],
  [Products.CASE]: [
    Infos.CASE_SPEC,
    Infos.CASE_MAIN,
    Infos.CASE_FAN,
    Infos.CASE_HARD_DRIVE,
    Infos.CASE_RADIATOR,
    Infos.CASE_PSU,
    Infos.EXTERNAL_PORTS,
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

export const InfoToProduct: {
  [product in Products]: {
    [info in (typeof Info)[product][number]]?: {
      [attr in keyof Information.Info[info]]?: Product.Attribute[product];
    };
  };
} = {
  [Products.CPU]: {
    [Infos.CPU_SPEC]: {
      socket: "socket",
      total_cores: "total_cores",
      total_threads: "total_threads",
    },
    [Infos.CPU_PERF]: {
      base_frequency: "base_frequency",
      turbo_frequency: "turbo_frequency",
      tdp: "tdp",
    },
    [Infos.PROCESSOR_CACHE]: { L3_cache: "L3_cache" },
  },
  [Products.GPU]: {
    [Infos.GPU_SPEC]: { core_count: "core_count" },
    [Infos.GPU_PERF]: {
      base_frequency: "base_frequency",
      boost_frequency: "boost_frequency",
      tdp: "tdp",
    },
    [Infos.GPU_MEMORY]: {
      capacity: "memory_size",
      type: "memory_type",
    },
  },
  [Products.GRAPHIC_CARD]: {
    [Infos.GRAPHIC_CARD_SPEC]: {
      width: "width",
      height: "height",
      length: "length",
      minimum_psu: "minimum_psu",
    },
    [Infos.GPU_PERF]: {
      base_frequency: "base_frequency",
      boost_frequency: "boost_frequency",
    },
  },
  [Products.MAIN]: {
    [Infos.MAIN_SPEC]: {
      socket: "socket",
      form_factor: "form_factor",
      ram_form_factor: "ram_form_factor",
      ram_interface: "ram_interface",
    },
  },
  [Products.RAM]: {
    [Infos.RAM_SPEC]: {
      speed: "speed",
      form_factor: "form_factor",
      capacity: "capacity",
      interface: "interface",
    },
  },
  [Products.SSD]: {
    [Infos.SSD_SPEC]: {
      memory_type: "memory_type",
      capacity: "capacity",
      form_factor: "form_factor",
      interface: "interface",
    },
    [Infos.STORAGE_PERF]: {
      read_speed: "read_speed",
      write_speed: "write_speed",
    },
  },
  [Products.HDD]: {
    [Infos.HDD_SPEC]: {
      form_factor: "form_factor",
      capacity: "capacity",
      interface: "interface",
      rotational_speed: "rotational_speed",
    },
    [Infos.STORAGE_PERF]: {
      read_speed: "read_speed",
      write_speed: "write_speed",
    },
  },
  [Products.PSU]: {
    [Infos.PSU_SPEC]: {
      form_factor: "form_factor",
      wattage: "wattage",
      efficiency: "efficiency",
      modular: "modular",
    },
  },
  [Products.CASE]: {
    [Infos.CASE_SPEC]: { form_factor: "form_factor" },
    [Infos.CASE_MAIN]: { form_factor: "mainboard_support" },
    [Infos.CASE_RADIATOR]: { form_factor: "radiator_support" },
    [Infos.CASE_PSU]: { psu_support: "psu_support" },
  },
  [Products.COOLER]: {
    [Infos.CPU_BLOCK_SOCKET]: { socket: "socket" },
    [Infos.CPU_BLOCK_SPEC]: { plate: "cpu_plate" },
    [Infos.RADIATOR_SPEC]: { height: "height" },
  },
  [Products.AIO]: {
    [Infos.CPU_BLOCK_SOCKET]: { socket: "socket" },
    [Infos.RADIATOR_SPEC]: { form_factor: "form_factor" },
    [Infos.CPU_BLOCK_SPEC]: { plate: "cpu_plate" },
  },
  [Products.FAN]: {
    [Infos.FAN_SPEC]: {
      form_factor: "form_factor",
      bearing: "bearing",
      speed: "speed",
    },
  },
  [Products.CPU_BLOCK]: {
    [Infos.CPU_BLOCK_SOCKET]: { socket: "socket" },
    [Infos.CPU_BLOCK_SPEC]: { plate: "plate" },
  },
  [Products.PUMP]: {
    [Infos.PUMP_SPEC]: {
      form_factor: "form_factor",
      head_pressure: "head_pressure",
      flow_rate: "flow_rate",
      power_connector: "power_connector",
      control_connector: "control_connector",
    },
  },
  [Products.RADIATOR]: {
    [Infos.RADIATOR_SPEC]: {
      form_factor: "form_factor",
      material: "material",
    },
  },
};

/**
 * The attribute mapping from the {@link Product} namespace
 * to the {@link Info} namespace.
 * Each {@link Product} attribute is mapped by an tuple
 * of {@link Infos} and the attribute key corresponding
 * to the {@link Info} namespace.
 */
export const ProductToInfo = Object.entries(InfoToProduct).reduce(
  (productAcc, [productKey, infoObject]) => {
    const product = productKey as Products;

    const records = Object.entries<Record<string, string>>(infoObject);
    for (const [infoKey, fields] of records) {
      const info = infoKey as Infos;
      productAcc[product] ??= {};

      for (const [infoField, productField] of Object.entries(fields)) {
        productAcc[product][productField] = [info, infoField];
      }
    }

    return productAcc;
  },
  {} as { [key in Products]: Record<string, [Infos, string]> }
);

/**
 * The summary attribute mapping from the {@link Products} to the {@link Infos} type.
 * Contains all the summary attributes of each {@link Infos} type that a {@link Products} type can have.
 */
export const SummaryAttributeMapping = Object.values(Products).reduce(
  (mapping, key) => {
    const product = key as Products;
    const productAttrs = Product.Summary[product].keyof().options;

    mapping[key] = productAttrs.reduce((productMapping, attr) => {
      const [info, key] = ProductToInfo[product][attr];

      productMapping[info] ??= [];

      productMapping[info].push(key);
      return productMapping;
    }, {} as { [key in Infos]?: string[] });
    return mapping;
  },
  {} as { [key in Products]: { [key in Infos]?: string[] } }
);
