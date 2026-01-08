import { InternalConnectors, ExternalPorts } from "../interface/utils";

type PinNumber = { main?: number; cpu?: number; pcie?: number };
type PowerConnectorObject = {
  [key in InternalConnectors.Power]?: number;
};
type GraphicCardPowerConnectorObject = {
  [key in InternalConnectors.Power.GraphicCard]?: number;
};

export class PowerConnectorExchanger {
  static toNumber(value: PowerConnectorObject | null): PinNumber {
    const result: PinNumber = {};

    if (value) {
      if ("ATX Main 20 + 4 pin" in value) {
        result.main = 24;
      } else if ("ATX Main 20 pin" in value) {
        result.main = 20;
      }

      if ("ATX 12V 4 + 4 pin" in value) {
        result.cpu = 8 * (value["ATX 12V 4 + 4 pin"] as number);
      }
      if ("ATX 12V 4 pin" in value) {
        result.cpu = result.cpu ? result.cpu + 4 : 4;
      }

      const pcie = this.toPCIePin(value);
      if (pcie) {
        result.pcie = pcie;
      }
    }

    return result;
  }

  static toObject({ main, cpu, pcie }: PinNumber): PowerConnectorObject | null {
    if (!main && !cpu && !pcie) {
      return null;
    }

    let result: PowerConnectorObject = {};

    if (main) {
      const powerStr = main === 24 ? "ATX Main 20 + 4 pin" : "ATX Main 20 pin";
      result[powerStr] = 1;
    }

    if (cpu) {
      result["ATX 12V 4 + 4 pin"] = Math.floor(cpu / 8);

      if (cpu % 8 === 4) {
        result["ATX 12V 4 pin"] = 1;
      }
    }

    if (pcie) {
      result = { ...result, ...this.toPCIeConnector(pcie) };
    }

    return result;
  }

  private static toPCIePin(
    value: GraphicCardPowerConnectorObject | null
  ): number | null {
    if (!value) {
      return null;
    }

    if ("12VHPWR" in value) {
      return 12;
    }

    let power_connector: number = 0;
    if ("PCIe 6 pin" in value) {
      power_connector += 6;
    }
    if ("PCIe 6 + 2 pin" in value) {
      power_connector += 8 * (value["PCIe 6 + 2 pin"] as number);
    }

    return power_connector > 0 ? power_connector : null;
  }

  private static toPCIeConnector(
    pcie?: number
  ): GraphicCardPowerConnectorObject {
    if (!pcie) {
      return {};
    }

    if (pcie === 12) {
      return { "12VHPWR": 1 };
    }

    const result: GraphicCardPowerConnectorObject = {};

    if (pcie >= 8) {
      result["PCIe 6 + 2 pin"] = Math.floor(pcie / 8);
    }

    if (pcie % 8 === 6) {
      result["PCIe 6 pin"] = 1;
    }

    return result;
  }
}

type PCIeInfo = { version: number; width: number };

export class PCIeExchanger {
  static toString({ version, width }: PCIeInfo): InternalConnectors.PCIe {
    const versionStr = version.toLocaleString(undefined, {
      minimumFractionDigits: 1,
    });

    return `PCIe ${versionStr} x${width}` as InternalConnectors.PCIe;
  }

  static toObject(value: string): PCIeInfo {
    const [, version, width] = value.match(InternalConnectors.PCIe.Regex)!;

    if (!version || !width) {
      throw new Error("Invalid PCIe string");
    }

    return { version: parseFloat(version), width: parseInt(width) };
  }
}

type USBInfo = {
  generation: ExternalPorts.Peripheral.USB.Generation;
  connector: ExternalPorts.Peripheral.USB.Connector;
};

export class USBExchanger {
  static toString({
    generation,
    connector,
  }: USBInfo): ExternalPorts.Peripheral.USB {
    return `USB ${generation} ${connector}`;
  }

  static toObject(value: string): USBInfo {
    const [, generation, connector] = value.match(
      ExternalPorts.Peripheral.USB.Regex
    )!;

    if (!generation || !connector) {
      throw new Error("Invalid USB string");
    }

    return {
      generation: generation as ExternalPorts.Peripheral.USB.Generation,
      connector: connector as ExternalPorts.Peripheral.USB.Connector,
    };
  }
}
