import {
  FormFactor,
  FilterOptions,
  ExternalPorts,
  InternalConnectors,
} from "../utils";
import { z } from "zod";

namespace Mainboard {
  export const PCIeSchema = z.record(
    InternalConnectors.PCIe.Controller,
    z.record(InternalConnectors.PCIe.Schema, z.number())
  );

  export type PCIe = z.infer<typeof PCIeSchema>;

  export const PowerConnectorSchema = z.record(
    InternalConnectors.Power.Mainboard,
    z.number()
  );

  export type PowerConnector = z.infer<typeof PowerConnectorSchema>;

  export const StorageConnectorSchema = z.record(
    InternalConnectors.Storage.Schema,
    z.number()
  );

  export const FanConnectorSchema = z.record(
    InternalConnectors.Fan.Schema,
    z.number()
  );

  export type StorageConnector = z.infer<typeof StorageConnectorSchema>;

  export const USBConnectorSchema = z.record(
    ExternalPorts.USB.Schema,
    z.number()
  );

  export type USBConnector = z.infer<typeof USBConnectorSchema>;

  export const BackPanelPortSchema = z.record(ExternalPorts.Schema, z.number());

  export type BackPanelPort = z.infer<typeof BackPanelPortSchema>;

  export const Schema = z.object({
    form_factor: FormFactor.Mainboard,

    socket: z.string(),
    chipset: z.string(),

    ram_form_factor: FormFactor.RAM,
    ram_interface: InternalConnectors.RAM,
    ram_slot: z.number(),
    expansion_slots: z.number(),

    pcies: PCIeSchema,

    power_connectors: PowerConnectorSchema,
    fan_connectors: FanConnectorSchema,
    storage_connectors: StorageConnectorSchema,
    usb_connectors: USBConnectorSchema,
    miscelanous_connectors: z.record(z.string(), z.number()),

    back_panel_ports: BackPanelPortSchema,
  });

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    form_factor: true,
    socket: true,
    ram_form_factor: true,
    ram_interface: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(FormFactor.Mainboard),
      socket: FilterOptions(z.string()),
      ram_form_factor: FilterOptions(FormFactor.RAM),
      ram_interface: FilterOptions(InternalConnectors.RAM),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.Mainboard.options,
    ram_form_factor: FormFactor.RAM.options,
    ram_interface: InternalConnectors.RAM.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Mainboard;
