import { z } from "zod";

namespace FormFactor {
  export const Mainboard = z.enum([
    "Pico-ITX",
    "Mini-ITX",
    "Mini-ATX",
    "microATX",
    "ATX",
    "EATX",
  ]);

  export type Mainboard = z.infer<typeof Mainboard>;

  export const RAM = z.enum(["DIMM", "SO-DIMM", "CAMM2"]);

  export type RAM = z.infer<typeof RAM>;

  export const SSD = z.enum([
    "2.5",
    "U.2",
    "mSATA",
    "M.2 2230",
    "M.2 2242",
    "M.2 2280",
    "M.2 22110",
  ]);

  export type SSD = z.infer<typeof SSD>;

  export const HDD = z.enum(["2.5", "3.5"]);

  export type HDD = z.infer<typeof HDD>;

  export const PSU = z.enum([
    "ATX PS/2",
    "ATX PS/3",
    "SFX",
    "SFX-L",
    "TFX",
    "Flex ATX",
  ]);

  export type PSU = z.infer<typeof PSU>;

  export const Case = z.enum([
    "Mini-Tower",
    "Micro-Tower",
    "Mid-Tower",
    "Full-Tower",
  ]);

  export type Case = z.infer<typeof Case>;

  export const Fan = z.enum(["40", "80", "92", "120", "140", "180", "200"]);

  export type Fan = z.infer<typeof Fan>;

  export const AIO = z.enum(["120", "140", "240", "280", "360", "420"]);

  export type AIO = z.infer<typeof AIO>;
}

namespace InternalConnectors {
  export namespace Power {
    export const Mainboard = z.enum([
      "ATX Main 20 pin",
      "ATX Main 20 + 4 pin",
      "ATX 12V 4 pin",
      "ATX 12V 4 + 4 pin",
      "PCIe 6 pin",
      "PCIe 6 + 2 pin",
    ]);

    export type MainboardType = z.infer<typeof Mainboard>;

    export const GraphicCard = z.enum([
      "PCIe 6 pin",
      "PCIe 6 + 2 pin",
      "12VHPWR",
    ]);

    export type GraphicCardType = z.infer<typeof GraphicCard>;

    export const Miscellanous = z.enum([
      "SATA",
      "Molex 4 pin",
      "Floppy Disk 4 pin",
    ]);

    export type MiscellanousType = z.infer<typeof Miscellanous>;

    export const Schema = z.union([Mainboard, GraphicCard, Miscellanous]);

    export type ConnectorType = z.infer<typeof Schema>;
  }

  export namespace PCIe {
    export const Controllers = z.enum(["cpu", "chipset"]);

    export type ControllerType = z.infer<typeof Controllers>;

    export const Widths = z.enum(["x16", "x8", "x4", "x2", "x1"]);

    export type WidthType = z.infer<typeof Widths>;

    export const Regex = new RegExp(`PCIe (\\d\\.?\\d?) x(\\d{1,2})`);

    export const Schema = z.string().regex(Regex);

    export type SchemaType = `PCIe ${number} ${WidthType}`;
  }

  export const RAM = z.enum([
    "DDR1",
    "DDR2",
    "DDR3",
    "LPDDR3",
    "DDR4",
    "LPDDR4",
    "DDR5",
  ]);

  export type RAM = z.infer<typeof RAM>;

  export namespace Storage {
    export const SSD = z.enum(["SATA", "U.2", "mSATA", "M.2 PCIe"]);

    export type SSD = z.infer<typeof SSD>;

    export const HDD = z.enum(["SATA", "SAS", "PATA"]);

    export type HDD = z.infer<typeof HDD>;

    export const Schema = z.union([SSD, HDD]);
  }

  export type Storage = z.infer<typeof Storage.Schema>;

  export namespace Fan {
    export const Connectors = z.enum([
      "CPU",
      "CPU OPT",
      "AIO Pump",
      "Radiator",
      "Q Fan",
      "H AMP",
      "Chassis",
    ]);

    export type ConnectorType = z.infer<typeof Connectors>;

    export const Interfaces = z.enum(["3 pin", "4 pin"]);

    export type InterfaceType = z.infer<typeof Interfaces>;

    export const Regex = new RegExp(
      `(${Interfaces.options.join("|")}) ${Connectors.options.join("|")}`
    );

    export const Schema = z.string().regex(Regex);

    export type SchemaType = `${InterfaceType} ${ConnectorType}`;
  }

  export const Sound = z.enum(["Front Panel Audio Header", "SPDIF Out Header"]);

  export const RGB = z.enum(["4 pin 12V RGB", "3 pin 5V Addressable RGB"]);

  export const Miscellanous = z.enum([
    "Front Panel Header",
    "Serial COM Port Header",
    "Parallel LPT Port Header",
    "Chassis Intrusion Header",
    "Thunderbolt Header",
    "Temperature Sensor Header",
    "TPM Header",
  ]);
}

namespace ExternalPorts {
  export namespace USB {
    export const Generations = z.enum(["1.0", "2.0", "3.0", "3.1", "3.2", "4"]);

    export type GenerationType = z.infer<typeof Generations>;

    export const Connectors = z.enum([
      "Type-A",
      "Type-B",
      "Micro-A",
      "Micro-AB",
      "Micro-B",
      "Type-C",
    ]);

    export type ConnectorType = z.infer<typeof Connectors>;

    export const Regex = new RegExp(
      `USB (${Generations.options.join("|")}) (${Connectors.options.join("|")})`
    );

    export const Schema = z.string().regex(Regex);

    export type SchemaType = `USB ${GenerationType} ${ConnectorType}`;
  }

  export namespace Ethernet {
    export const Speeds = z.enum(["10/100", "1G", "2.5G", "5G", "10G"]);

    export type SpeedType = z.infer<typeof Speeds>;

    export const Interfaces = z.enum(["RJ45", "SFP", "SFP+", "QSFP", "QSFP+"]);

    export type InterfaceType = z.infer<typeof Interfaces>;

    export const Regex = new RegExp(
      `(${Speeds.options.join("|")}) (${Interfaces.options.join(
        "|"
      )}) LAN Ethernet`
    );

    export const Schema = z.string().regex(Regex);

    export type SchemaType = `${SpeedType} ${InterfaceType} LAN Ethernet`;
  }

  export namespace PS2 {
    export const Ports = z.enum(["Keyboard", "Mouse", "Dual"]);

    export type PortType = z.infer<typeof Ports>;

    export const Regex = new RegExp(`${Ports} PS/2`);

    export const Schema = z.string().regex(Regex);

    export type SchemaType = `${PortType} PS/2`;
  }

  export namespace Display {
    export namespace HDMI {
      export const Versions = z.enum([
        "1.0",
        "1.1",
        "1.2",
        "1.2a",
        "1.3",
        "1.3a",
        "1.4",
        "1.4a",
        "1.4b",
        "2.0",
        "2.0a",
        "2.0b",
        "2.1",
        "2.1a",
        "2.1b",
      ]);

      export type VersionType = z.infer<typeof Versions>;

      export const Connectors = z.enum([
        "Type A, Standard",
        "Type B, Dual-link",
        "Type C, Mini",
        "Type D, Micro",
        "Type E, Automotive",
      ]);

      export type ConnectorType = z.infer<typeof Connectors>;

      export const Regex = new RegExp(
        `HDMI (${Versions.options.join("|")}) (${Connectors.options.join("|")})`
      );

      export const Schema = z.string().regex(Regex);

      export type SchemaType = `${ConnectorType} HDMI ${VersionType}`;
    }

    export namespace DisplayPort {
      export const Versions = z.enum([
        "1.0",
        "1.1",
        "1.1a",
        "1.2",
        "1.2a",
        "1.3",
        "1.4",
        "1.4a",
        "2.0",
        "2.1",
        "2.1a",
      ]);

      export type VersionType = z.infer<typeof Versions>;

      export const Regex = new RegExp(
        `DisplayPort (${Versions.options.join("|")})`
      );

      export const Schema = z.string().regex(Regex);

      export type SchemaType = `DisplayPort ${VersionType}`;
    }

    export namespace DVI {
      export const Schema = z.enum([
        "DVI-D",
        "DVI-I",
        "DVI-A",
        "Mini-DVI",
        "Micro-DVI",
      ]);

      export type SchemaType = z.infer<typeof Schema>;
    }

    export namespace VGA {
      export const Schema = z.enum(["VGA", "Mini-VGA"]);

      export type SchemaType = z.infer<typeof Schema>;
    }

    export const Schema = z.union([
      HDMI.Schema,
      DisplayPort.Schema,
      DVI.Schema,
      VGA.Schema,
    ]);

    export type DisplayType =
      | HDMI.SchemaType
      | DisplayPort.SchemaType
      | DVI.SchemaType
      | VGA.SchemaType;
  }

  export namespace Audio {
    export namespace HDAudio {
      export const Ports = z.enum([
        "Line-Out/Mic-In",
        "Rear",
        "Center/Subwoofer",
        "Side",
        "Line-In",
        "Line-Out",
        "Mic-In",
      ]);

      export type PortType = z.infer<typeof Ports>;

      export const Regex = new RegExp(
        `(${Ports.options.join("|")}) HD Audio Port`
      );

      export const Schema = z.string().regex(Regex);

      export type SchemaType = `${PortType} HD Audio Port`;
    }

    export namespace SPDIF {
      export const Interfaces = z.enum(["Optical", "Coaxial"]);

      export type InterfaceType = z.infer<typeof Interfaces>;

      export const Regex = new RegExp(
        `(${Interfaces.options.join("|")}) S/PDIF`
      );

      export const Schema = z.string().regex(Regex);

      export type SchemaType = `${InterfaceType} S/PDIF`;
    }
  }

  export const Button = z.enum([
    "Power Button",
    "Reset Button",
    "Clear CMOS Button",
    "Flash BIOS Button",
  ]);

  export const Schema = z.union([
    Button,
    USB.Schema,
    PS2.Schema,
    Ethernet.Schema,
    Display.Schema,
    Audio.HDAudio.Schema,
    Audio.SPDIF.Schema,
  ]);

  export type SchemaType = z.infer<typeof Schema>;
}

type FilterOptionsType<Info extends {}, Attributes extends keyof Info> = {
  [key in Attributes]?: Required<Info>[key][];
};

const NumberFilterOptions = z.array(z.number());

const FilterOptions = <T extends z.ZodTypeAny>(zodType: T) => z.array(zodType);

export {
  FormFactor,
  InternalConnectors,
  ExternalPorts,
  NumberFilterOptions,
  FilterOptions,
};

export type { FilterOptionsType };
