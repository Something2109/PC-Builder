enum Topics {
  INTRODUCTION = "introduction",
  GUIDE = "guide",
  FORUM = "forum",
}

enum Roles {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

enum Products {
  CPU = "cpu",
  GPU = "gpu",
  GRAPHIC_CARD = "graphic_card",
  MAIN = "mainboard",
  RAM = "ram",
  SSD = "ssd",
  HDD = "hdd",
  PSU = "psu",
  CASE = "case",
  COOLER = "cooler",
  AIO = "aio",
  FAN = "fan",
  CPU_BLOCK = "cpu_block",
  PUMP = "pump",
  RADIATOR = "radiator",
}

enum Infos {
  CPU_SPEC = "cpu_spec",
  CPU_CORES = "cpu_core_config",
  CPU_PERF = "cpu_performance",
  GPU_SPEC = "gpu_spec",
  GPU_PERF = "gpu_performance",
  GPU_FEAT = "gpu_feature",
  PROCESSOR_CACHE = "processor_cache",
  PROCESSOR_MEMORY = "processor_memory",
  GRAPHIC_CARD_SPEC = "graphic_card_spec",
  MAIN_SPEC = "mainboard_spec",
  MAIN_PCIE = "mainboard_pcie",
  MAIN_STORAGE = "mainboard_storage",
  MAIN_USB = "mainboard_usb",
  RAM_SPEC = "ram_spec",
  SSD_SPEC = "ssd_spec",
  HDD_SPEC = "hdd_spec",
  STORAGE_PERF = "storage_performance",
  STORAGE_CACHE = "storage_cache",
  PSU_SPEC = "psu_spec",
  CASE_SPEC = "case_spec",
  CASE_MAIN = "case_mainboard_support",
  CASE_FAN = "case_fan_support",
  CASE_HARD_DRIVE = "case_hard_drive_support",
  CASE_RADIATOR = "case_radiator_support",
  CASE_PSU = "case_psu_support",
  FAN_SPEC = "fan_spec",
  CPU_BLOCK_SPEC = "cpu_block_spec",
  CPU_BLOCK_SOCKET = "cpu_block_socket",
  PUMP_SPEC = "pump_spec",
  RADIATOR_SPEC = "radiator_spec",
}

export { Topics, Roles, Products, Infos };
