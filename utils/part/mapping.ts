import * as Information from "./info";
import * as Product from "./product";

/**
 * The mapping from the {@link Product.Name} to the {@link Info} type.
 * Contains all the {@link Info} that a {@link Product.Name} type can have.
 */
export const Info = {
  [Product.Name.CPU]: [
    Information.Name.CPU_SPEC,
    Information.Name.CPU_PERF,
    Information.Name.CPU_CORES,
    Information.Name.CPU_MEMORY,
    Information.Name.PROCESSOR_CACHE,
    Information.Name.GPU_SPEC,
    Information.Name.GPU_PERF,
    Information.Name.GPU_FEAT,
  ],
  [Product.Name.GPU]: [
    Information.Name.GPU_SPEC,
    Information.Name.GPU_PERF,
    Information.Name.GPU_MEMORY,
    Information.Name.GPU_FEAT,
    Information.Name.PROCESSOR_CACHE,
  ],
  [Product.Name.GRAPHIC_CARD]: [
    Information.Name.GRAPHIC_CARD_SPEC,
    Information.Name.GPU_MEMORY,
    Information.Name.GPU_PERF,
    Information.Name.GRAPHIC_CARD_PORT,
  ],
  [Product.Name.MAIN]: [
    Information.Name.MAIN_SPEC,
    Information.Name.MAIN_POWER,
    Information.Name.MAIN_PCIE,
    Information.Name.MAIN_STORAGE,
    Information.Name.MAIN_USB,
    Information.Name.MAIN_FAN,
    Information.Name.EXTERNAL_PORTS,
  ],
  [Product.Name.RAM]: [Information.Name.RAM_SPEC],
  [Product.Name.SSD]: [
    Information.Name.SSD_SPEC,
    Information.Name.STORAGE_PERF,
    Information.Name.STORAGE_CACHE,
  ],
  [Product.Name.HDD]: [
    Information.Name.HDD_SPEC,
    Information.Name.STORAGE_PERF,
    Information.Name.STORAGE_CACHE,
  ],
  [Product.Name.PSU]: [
    Information.Name.PSU_SPEC,
    Information.Name.PSU_CONNECTOR,
  ],
  [Product.Name.CASE]: [
    Information.Name.CASE_SPEC,
    Information.Name.CASE_MAIN,
    Information.Name.CASE_FAN,
    Information.Name.CASE_HARD_DRIVE,
    Information.Name.CASE_RADIATOR,
    Information.Name.CASE_PSU,
    Information.Name.EXTERNAL_PORTS,
  ],
  [Product.Name.COOLER]: [
    Information.Name.CPU_BLOCK_SPEC,
    Information.Name.CPU_BLOCK_SOCKET,
    Information.Name.FAN_SPEC,
    Information.Name.RADIATOR_SPEC,
  ],
  [Product.Name.AIO]: [
    Information.Name.CPU_BLOCK_SPEC,
    Information.Name.CPU_BLOCK_SOCKET,
    Information.Name.FAN_SPEC,
    Information.Name.PUMP_SPEC,
    Information.Name.RADIATOR_SPEC,
  ],
  [Product.Name.FAN]: [Information.Name.FAN_SPEC],
  [Product.Name.CPU_BLOCK]: [
    Information.Name.CPU_BLOCK_SPEC,
    Information.Name.CPU_BLOCK_SOCKET,
  ],
  [Product.Name.PUMP]: [Information.Name.PUMP_SPEC],
  [Product.Name.RADIATOR]: [Information.Name.RADIATOR_SPEC],
} as const;

export const InfoToProduct: {
  [product in Product.Name]: {
    [info in (typeof Info)[product][number]]?: {
      [attr in keyof Information.Info[info]]?: Product.Attribute[product];
    };
  };
} = {
  [Product.Name.CPU]: {
    [Information.Name.CPU_SPEC]: {
      socket: "socket",
      total_cores: "total_cores",
      total_threads: "total_threads",
    },
    [Information.Name.CPU_PERF]: {
      base_frequency: "base_frequency",
      turbo_frequency: "turbo_frequency",
      tdp: "tdp",
    },
    [Information.Name.PROCESSOR_CACHE]: { L3_cache: "L3_cache" },
  },
  [Product.Name.GPU]: {
    [Information.Name.GPU_SPEC]: { core_count: "core_count" },
    [Information.Name.GPU_PERF]: {
      base_frequency: "base_frequency",
      boost_frequency: "boost_frequency",
      tdp: "tdp",
    },
    [Information.Name.GPU_MEMORY]: {
      capacity: "memory_size",
      type: "memory_type",
    },
  },
  [Product.Name.GRAPHIC_CARD]: {
    [Information.Name.GRAPHIC_CARD_SPEC]: {
      width: "width",
      height: "height",
      length: "length",
      minimum_psu: "minimum_psu",
    },
    [Information.Name.GPU_PERF]: {
      base_frequency: "base_frequency",
      boost_frequency: "boost_frequency",
    },
  },
  [Product.Name.MAIN]: {
    [Information.Name.MAIN_SPEC]: {
      socket: "socket",
      form_factor: "form_factor",
      ram_form_factor: "ram_form_factor",
      ram_interface: "ram_interface",
    },
  },
  [Product.Name.RAM]: {
    [Information.Name.RAM_SPEC]: {
      speed: "speed",
      form_factor: "form_factor",
      capacity: "capacity",
      interface: "interface",
    },
  },
  [Product.Name.SSD]: {
    [Information.Name.SSD_SPEC]: {
      memory_type: "memory_type",
      capacity: "capacity",
      form_factor: "form_factor",
      interface: "interface",
    },
    [Information.Name.STORAGE_PERF]: {
      read_speed: "read_speed",
      write_speed: "write_speed",
    },
  },
  [Product.Name.HDD]: {
    [Information.Name.HDD_SPEC]: {
      form_factor: "form_factor",
      capacity: "capacity",
      interface: "interface",
      rotational_speed: "rotational_speed",
    },
    [Information.Name.STORAGE_PERF]: {
      read_speed: "read_speed",
      write_speed: "write_speed",
    },
  },
  [Product.Name.PSU]: {
    [Information.Name.PSU_SPEC]: {
      form_factor: "form_factor",
      wattage: "wattage",
      efficiency: "efficiency",
      modular: "modular",
    },
  },
  [Product.Name.CASE]: {
    [Information.Name.CASE_SPEC]: { form_factor: "form_factor" },
    [Information.Name.CASE_MAIN]: { form_factor: "mainboard_support" },
    [Information.Name.CASE_RADIATOR]: { form_factor: "radiator_support" },
    [Information.Name.CASE_PSU]: { psu_support: "psu_support" },
  },
  [Product.Name.COOLER]: {
    [Information.Name.CPU_BLOCK_SOCKET]: { socket: "socket" },
    [Information.Name.CPU_BLOCK_SPEC]: { plate: "cpu_plate" },
    [Information.Name.RADIATOR_SPEC]: { height: "height" },
  },
  [Product.Name.AIO]: {
    [Information.Name.CPU_BLOCK_SOCKET]: { socket: "socket" },
    [Information.Name.RADIATOR_SPEC]: { form_factor: "form_factor" },
    [Information.Name.CPU_BLOCK_SPEC]: { plate: "cpu_plate" },
  },
  [Product.Name.FAN]: {
    [Information.Name.FAN_SPEC]: {
      form_factor: "form_factor",
      bearing: "bearing",
      speed: "speed",
    },
  },
  [Product.Name.CPU_BLOCK]: {
    [Information.Name.CPU_BLOCK_SOCKET]: { socket: "socket" },
    [Information.Name.CPU_BLOCK_SPEC]: { plate: "plate" },
  },
  [Product.Name.PUMP]: {
    [Information.Name.PUMP_SPEC]: {
      form_factor: "form_factor",
      head_pressure: "head_pressure",
      flow_rate: "flow_rate",
      power_connector: "power_connector",
      control_connector: "control_connector",
    },
  },
  [Product.Name.RADIATOR]: {
    [Information.Name.RADIATOR_SPEC]: {
      form_factor: "form_factor",
      material: "material",
    },
  },
};

/**
 * The attribute mapping from the {@link Product} namespace
 * to the {@link Info} namespace.
 * Each {@link Product} attribute is mapped by an tuple
 * of {@link Information.Name} and the attribute key corresponding
 * to the {@link Info} namespace.
 */
export const ProductToInfo = Object.entries(InfoToProduct).reduce(
  (productAcc, [productKey, infoObject]) => {
    const product = productKey as Product.Name;

    const records = Object.entries<Record<string, string>>(infoObject);
    for (const [infoKey, fields] of records) {
      const info = infoKey as Information.Name;
      productAcc[product] ??= {};

      for (const [infoField, productField] of Object.entries(fields)) {
        productAcc[product][productField] = [info, infoField];
      }
    }

    return productAcc;
  },
  {} as { [key in Product.Name]: Record<string, [Information.Name, string]> }
);

/**
 * The summary attribute mapping from the {@link Product.Name} to the {@link Information.Name} type.
 * Contains all the summary attributes of each {@link Information.Name} type that a {@link Product.Name} type can have.
 */
export const SummaryAttributeMapping = Object.values(Product.Name).reduce(
  (mapping, key) => {
    const product = key as Product.Name;
    const productAttrs = Product.Summary[product].keyof().options;

    mapping[key] = productAttrs.reduce((productMapping, attr) => {
      const [info, key] = ProductToInfo[product][attr];

      productMapping[info] ??= [];

      productMapping[info].push(key);
      return productMapping;
    }, {} as { [key in Information.Name]?: string[] });
    return mapping;
  },
  {} as { [key in Product.Name]: { [key in Information.Name]?: string[] } }
);
