import { InternalConnectors, ExternalPorts } from "@/utils/interface/utils";
import MainboardPCIe from "@/utils/interface/part/info/MainboardPCIe";
import MainboardFanConnector from "@/utils/interface/part/info/MainboardFanConnector";
import MainboardPowerConnector from "@/utils/interface/part/info/MainboardPowerConnector";
import MainboardStorageConnector from "@/utils/interface/part/info/MainboardStorageConnector";
import MainboardUSBConnector from "@/utils/interface/part/info/MainboardUSBConnector";
import PartExternalPorts from "@/utils/interface/part/info/PartExternalPorts";

export function parseMainboardSpec(raw: Record<string, string>) {
  const getText = (keys: string[]) => keys.map((k) => raw[k] || "").join(" ");

  const normalizeCount = <T>(items: T[]) =>
    Array.from(
      items.reduce((acc, item) => {
        const key = JSON.stringify(item);
        acc.set(key, (acc.get(key) || 0) + 1);
        return acc;
      }, new Map<string, number>())
    ).map(([rawKey, count]) => ({ ...JSON.parse(rawKey), count }));

  // --- PCIe ---
  const pcieMatches = Array.from(
    getText(["Expansion Slots"]).matchAll(
      /PCIe (\d(?:\.\d)?) and running at (x\d+)/g
    )
  );
  const pcie: MainboardPCIe.Info[] = pcieMatches.map(([_, ver, width]) => ({
    controller: width.includes("16") ? "CPU" : "Chipset",
    version: parseFloat(ver),
    width: width as InternalConnectors.PCIe.Width,
    count: 1,
  }));

  // --- Fan ---
  const fanMatches = Array.from(
    getText(["Internal I/O Connectors"]).matchAll(InternalConnectors.Fan.Regex)
  );
  const fan: MainboardFanConnector.Info[] = normalizeCount(
    fanMatches.map(([_, connector, type]) => ({
      connector: connector as InternalConnectors.Fan.Connector,
      type: type as InternalConnectors.Fan.Type,
    }))
  );

  // --- Power ---
  const power: MainboardPowerConnector.Info[] =
    InternalConnectors.Power.Mainboard.options.flatMap((type) => {
      const matches = (
        getText(["Internal I/O Connectors"]).match(new RegExp(type, "g")) || []
      ).length;
      return matches ? [{ type, count: matches }] : [];
    });

  // --- Storage ---
  const storage: MainboardStorageConnector.Info[] = [];
  const m2Count = (getText(["Storage Interface"]).match(/M\.2/g) || []).length;
  const sataCount = (getText(["Storage Interface"]).match(/SATA 6Gb\/s/g) || [])
    .length;
  if (m2Count) storage.push({ form_factor: "M.2 PCIe", count: m2Count });
  if (sataCount) storage.push({ form_factor: "SATA", count: sataCount });

  // --- USB ---
  const usbInternalText = getText(["USB", "Internal I/O Connectors"]);
  const usbBackPanelText = getText(["Back Panel Connectors"]);

  const usbInternalMatches = Array.from(
    usbInternalText.matchAll(/USB\s(\d(?:\.\d)?)\s(Type-[AC])/g)
  );
  const usbInternal: MainboardUSBConnector.Info[] = normalizeCount(
    usbInternalMatches.map(([_, generation, connector]) => ({
      generation: generation as ExternalPorts.Peripheral.USB.Generation,
      connector: connector as ExternalPorts.Peripheral.USB.Connector,
    }))
  );

  const usbBackMatches = Array.from(
    usbBackPanelText.matchAll(/USB\s(\d(?:\.\d)?)\s(Type-[AC])/g)
  );
  const usbExternal: PartExternalPorts.Info[] = normalizeCount(
    usbBackMatches.map(([_, generation, connector]) => ({
      type: "Peripheral",
      name: `USB ${generation} ${connector}`,
    }))
  );

  // --- External Ports ---
  const external: PartExternalPorts.Info[] = [...usbExternal];

  if (raw["LAN"].includes("2.5GbE")) {
    external.push({
      type: "Network",
      name: "2.5G RJ45 LAN Ethernet",
      count: 1,
    });
  }

  if (raw["Audio"].includes("S/PDIF")) {
    external.push({ type: "Audio", name: "Optical S/PDIF", count: 1 });
  }

  if ((raw["Back Panel Connectors"].match(/audio jacks/g) || []).length) {
    external.push(
      { type: "Audio", name: "Line-Out HD Audio Port", count: 1 },
      { type: "Audio", name: "Mic-In HD Audio Port", count: 1 }
    );
  }

  if (raw["Back Panel Connectors"].includes("HDMI")) {
    external.push({
      type: "Display",
      name: "HDMI 2.1 Type A, Standard",
      count: 1,
    });
  }

  if (raw["Back Panel Connectors"].includes("DisplayPort")) {
    external.push({ type: "Display", name: "DisplayPort 1.2", count: 1 });
  }

  if (raw["Back Panel Connectors"].includes("PS/2")) {
    external.push({ type: "Peripheral", name: "Keyboard PS/2", count: 1 });
  }

  if (raw["Internal I/O Connectors"].includes("reset button")) {
    external.push({ type: "Interaction", name: "Reset Button", count: 1 });
  }

  return {
    pcie,
    fan,
    power,
    storage,
    usb: usbInternal,
    externalPorts: external,
  };
}
