import { z } from "zod";
import { Infos } from "../Enum";

namespace Primitive {
  export const String = z.string();

  export const Number = z.coerce.number().refine((val) => val >= 0);
}

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

  export const Pump = z.enum(["D5", "DDC"]);

  export type Pump = z.infer<typeof Pump>;

  export const Radiator = z.enum(["120", "140", "240", "280", "360", "420"]);

  export type Radiator = z.infer<typeof Radiator>;
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

    export type Mainboard = z.infer<typeof Mainboard>;

    export const GraphicCard = z.enum([
      "PCIe 6 pin",
      "PCIe 6 + 2 pin",
      "12VHPWR",
    ]);

    export type GraphicCard = z.infer<typeof GraphicCard>;

    export const Miscellanous = z.enum([
      "SATA",
      "Molex 4 pin",
      "Floppy Disk 4 pin",
    ]);

    export type Miscellanous = z.infer<typeof Miscellanous>;

    export const Schema = z.union([Mainboard, GraphicCard, Miscellanous]);
  }

  export type Power = Power.Mainboard | Power.GraphicCard | Power.Miscellanous;

  export namespace PCIe {
    export const Controller = z.enum(["cpu", "chipset"]);

    export type Controller = z.infer<typeof Controller>;

    export const Width = z.enum(["x16", "x8", "x4", "x2", "x1"]);

    export type Width = z.infer<typeof Width>;

    export const Regex = new RegExp(`PCIe (\\d\\.?\\d?) x(\\d{1,2})`);

    export const Schema = z.string().regex(Regex);
  }

  export type PCIe = `PCIe ${number} ${PCIe.Width}`;

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

  export type Storage = Storage.SSD | Storage.HDD;

  export namespace Fan {
    export const Type = z.enum([
      "CPU",
      "CPU OPT",
      "AIO Pump",
      "Radiator",
      "Q Fan",
      "H AMP",
      "Chassis",
    ]);

    export type Type = z.infer<typeof Type>;

    export const Connector = z.enum(["3 pin", "4 pin"]);

    export type Connector = z.infer<typeof Connector>;

    export const Regex = new RegExp(
      `(${Connector.options.join("|")}) (${Type.options.join(
        "|"
      )})? ?Fan Connector`
    );

    export const Schema = z.string().regex(Regex);
  }

  export type Fan = `${Fan.Type} ${Fan.Connector}`;

  export const Sound = z.enum(["Front Panel Audio Header", "SPDIF Out Header"]);

  export type Sound = z.infer<typeof Sound>;

  export const RGB = z.enum(["4 pin 12V RGB", "3 pin 5V Addressable RGB"]);

  export type RGB = z.infer<typeof RGB>;

  export const Miscellanous = z.enum([
    "Front Panel Header",
    "Serial COM Port Header",
    "Parallel LPT Port Header",
    "Chassis Intrusion Header",
    "Thunderbolt Header",
    "Temperature Sensor Header",
    "TPM Header",
  ]);

  export type Miscellanous = z.infer<typeof Miscellanous>;
}

type InternalConnectors =
  | InternalConnectors.Power
  | InternalConnectors.PCIe
  | InternalConnectors.RAM
  | InternalConnectors.Storage
  | InternalConnectors.Fan
  | InternalConnectors.Sound
  | InternalConnectors.RGB
  | InternalConnectors.Miscellanous;

namespace ExternalPorts {
  export namespace USB {
    export const Generation = z.enum(["1.0", "2.0", "3.0", "3.1", "3.2", "4"]);

    export type Generation = z.infer<typeof Generation>;

    export const Connector = z.enum([
      "Type-A",
      "Type-B",
      "Micro-A",
      "Micro-AB",
      "Micro-B",
      "Type-C",
    ]);

    export type Connector = z.infer<typeof Connector>;

    export const Regex = new RegExp(
      `USB (${Generation.options.join("|")}) (${Connector.options.join("|")})`
    );

    export const Schema = z.string().regex(Regex);
  }

  export type USB = `USB ${USB.Generation} ${USB.Connector}`;

  export namespace Ethernet {
    export const Speed = z.enum(["10/100", "1G", "2.5G", "5G", "10G"]);

    export type Speed = z.infer<typeof Speed>;

    export const Interface = z.enum(["RJ45", "SFP", "SFP+", "QSFP", "QSFP+"]);

    export type Interface = z.infer<typeof Interface>;

    export const Regex = new RegExp(
      `(${Speed.options.join("|")}) (${Interface.options.join(
        "|"
      )}) LAN Ethernet`
    );

    export const Schema = z.string().regex(Regex);
  }

  export type Ethernet = `${Ethernet.Speed} ${Ethernet.Interface} LAN Ethernet`;

  export namespace PS2 {
    export const Port = z.enum(["Keyboard", "Mouse", "Dual"]);

    export type Port = z.infer<typeof Port>;

    export const Regex = new RegExp(`${Port.options.join("|")} PS/2`);

    export const Schema = z.string().regex(Regex);
  }

  export type PS2 = `${PS2.Port} PS/2`;

  export namespace Display {
    export namespace HDMI {
      export const Version = z.enum([
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

      export type Version = z.infer<typeof Version>;

      export const Connector = z.enum([
        "Type A, Standard",
        "Type B, Dual-link",
        "Type C, Mini",
        "Type D, Micro",
        "Type E, Automotive",
      ]);

      export type Connector = z.infer<typeof Connector>;

      export const Regex = new RegExp(
        `HDMI (${Version.options.join("|")}) (${Connector.options.join("|")})`
      );

      export const Schema = z.string().regex(Regex);
    }

    export type HDMI = `${HDMI.Connector} HDMI ${HDMI.Version}`;

    export namespace DisplayPort {
      export const Version = z.enum([
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

      export type Version = z.infer<typeof Version>;

      export const Regex = new RegExp(
        `DisplayPort (${Version.options.join("|")})`
      );

      export const Schema = z.string().regex(Regex);
    }

    export type DisplayPort = `DisplayPort ${DisplayPort.Version}`;

    export const DVI = z.enum([
      "DVI-D",
      "DVI-I",
      "DVI-A",
      "Mini-DVI",
      "Micro-DVI",
    ]);

    export type DVI = z.infer<typeof DVI>;

    export const VGA = z.enum(["VGA", "Mini-VGA"]);

    export type VGA = z.infer<typeof VGA>;

    export const Schema = z.union([HDMI.Schema, DisplayPort.Schema, DVI, VGA]);
  }

  export type Display =
    | Display.HDMI
    | Display.DisplayPort
    | Display.DVI
    | Display.VGA;

  export namespace Audio {
    export namespace HDAudio {
      export const Port = z.enum([
        "Line-Out/Mic-In",
        "Rear",
        "Center/Subwoofer",
        "Side",
        "Line-In",
        "Line-Out",
        "Mic-In",
      ]);

      export type Port = z.infer<typeof Port>;

      export const Regex = new RegExp(
        `(${Port.options.join("|")}) HD Audio Port`
      );

      export const Schema = z.string().regex(Regex);
    }

    export type HDAudio = `${HDAudio.Port} HD Audio Port`;

    export namespace SPDIF {
      export const Interface = z.enum(["Optical", "Coaxial"]);

      export type Interface = z.infer<typeof Interface>;

      export const Regex = new RegExp(
        `(${Interface.options.join("|")}) S/PDIF`
      );

      export const Schema = z.string().regex(Regex);
    }

    export type SPDIF = `${SPDIF.Interface} S/PDIF`;

    export const Schema = z.union([HDAudio.Schema, SPDIF.Schema]);
  }

  export type Audio = Audio.HDAudio | Audio.SPDIF;

  export const Button = z.enum([
    "Power Button",
    "Reset Button",
    "Clear CMOS Button",
    "Flash BIOS Button",
  ]);

  export type Button = z.infer<typeof Button>;

  export const Schema = z.union([
    Button,
    USB.Schema,
    PS2.Schema,
    Ethernet.Schema,
    Display.Schema,
    Audio.Schema,
  ]);
}

type ExternalPorts =
  | ExternalPorts.Button
  | ExternalPorts.USB
  | ExternalPorts.PS2
  | ExternalPorts.Ethernet
  | ExternalPorts.Display
  | ExternalPorts.Audio;

namespace Material {
  export const Metal = z.enum([
    "Alluminium",
    "Brass",
    "Copper",
    "Inox",
    "Nickel-Plated Copper",
    "Nickel",
    "Stainless Steel",
  ]);

  export type Metal = z.infer<typeof Metal>;

  export const Plastic = z.enum([
    "Acetal",
    "Acrylic",
    "Nylon",
    "Plexi",
    "PPS-GF40",
  ]);

  export type Plastic = z.infer<typeof Plastic>;
}

namespace Case {
  export const Side = z.enum(["top", "bottom", "front", "rear", "side"]);

  export type Side = z.infer<typeof Side>;

  export const HardDrivePlace = z.enum([
    "top",
    "bottom",
    "front",
    "rear",
    "side",
    "drive_bay",
  ]);

  export type HardDrivePlace = z.infer<typeof HardDrivePlace>;

  export const HardDriveFormFactor = z.enum(["2.5", "3.5"]);

  export type HardDriveFormFactor = z.infer<typeof HardDriveFormFactor>;
}

type FilterOptionsType<Info extends {}, Attributes extends keyof Info> = {
  [key in Attributes]?: NonNullable<Required<Info>[key]> extends number
    ? number[]
    : Required<Info>[key] extends string
    ? Required<Info>[key][]
    : string[];
};

const ToSummaryOptions = (
  keys: string[],
  mapping: Record<string, [Infos, string]>
) => {
  return keys.reduce((acc, val) => {
    const [info, key] = mapping[val];

    if (!acc[info]) acc[info] = [];

    acc[info].push(key);
    return acc;
  }, {} as { [key in Infos]?: string[] });
};

const FilterOptions = <T extends z.ZodType>(zodType: T) =>
  z.preprocess((arg) => {
    return (Array.isArray(arg) ? arg : [arg])
      .map((val) => zodType.safeParse(val))
      .filter((val) => val.success)
      .map((val) => val.data)
      .sort((a, b) => a - b);
  }, z.array(zodType));

const NumberFilterOptions = FilterOptions(Primitive.Number).transform((arg) => {
  if (arg.length === 0) return [];

  if (arg.length === 1) return [0, arg[0]];

  return [arg[0], arg[arg.length - 1]];
});

export {
  Primitive,
  FormFactor,
  InternalConnectors,
  ExternalPorts,
  Material,
  Case,
  NumberFilterOptions,
  ToSummaryOptions,
  FilterOptions,
};

export type { FilterOptionsType };
