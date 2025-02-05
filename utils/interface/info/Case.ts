import { FormFactor, FilterOptions, ExternalPorts, Primitive } from "../utils";
import { z } from "zod";

export namespace Case {
  export const Side = z.enum(["top", "bottom", "front", "rear", "side"]);

  export type Side = z.infer<typeof Side>;

  export const RadiatorSupportSchema = z.record(
    Side,
    z.array(FormFactor.Radiator)
  );

  export type RadiatorSupport = z.infer<typeof RadiatorSupportSchema>;

  export const FanSupportSchema = z.record(
    Side,
    z.record(FormFactor.Fan, Primitive.Number)
  );

  export type FanSupport = z.infer<typeof FanSupportSchema>;

  export const HardDrivePlace = z.enum([...Case.Side.options, "Drive Bay"]);

  export type HardDrivePlace = z.infer<typeof HardDrivePlace>;

  export const HardDriveSize = z.enum(["2.5", "3.5"]);

  export type HardDriveSize = z.infer<typeof HardDriveSize>;

  export const HardDriveSupportSchema = z.record(
    HardDrivePlace,
    z.record(HardDriveSize, Primitive.Number)
  );

  export type HardDriveSupport = z.infer<typeof HardDriveSupportSchema>;

  export const FrontPanelPortSchema = z.record(
    ExternalPorts.Schema,
    Primitive.Number
  );

  export type FrontPanelPort = z.infer<typeof FrontPanelPortSchema>;

  export const Schema = z.object({
    form_factor: FormFactor.Case,

    width: Primitive.Number,
    length: Primitive.Number,
    height: Primitive.Number,

    mainboard_support: z.array(FormFactor.Mainboard),
    expansion_slot: Primitive.Number,

    max_cooler_height: Primitive.Number,

    radiator_support: RadiatorSupportSchema,
    fan_support: FanSupportSchema,

    hard_drive_support: HardDriveSupportSchema,

    psu_support: z.array(FormFactor.PSU),
    max_psu_length: Primitive.Number,

    front_panel_ports: FrontPanelPortSchema,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    form_factor: "Form Factor",

    width: "Width",
    length: "Length",
    height: "Height",

    mainboard_support: "Mainboard Support",
    expansion_slot: "Expansion Slot",

    max_cooler_height: "Max Cooler Height",

    radiator_support: "Radiator Support",
    fan_support: "Fan Support",

    hard_drive_support: "Hard Drive Support",

    psu_support: "PSU Support",
    max_psu_length: "Max PSU Length",

    front_panel_ports: "Front Panel Ports",
  };

  export const SummarySchema = Schema.pick({
    form_factor: true,
    mainboard_support: true,
    radiator_support: true,
    psu_support: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(FormFactor.Case),
      mainboard_support: FilterOptions(FormFactor.Mainboard),
      radiator_support: FilterOptions(FormFactor.Radiator),
      psu_support: FilterOptions(FormFactor.PSU),
    })
    .partial();

  export const DefaultFilterOptions = {
    form_factor: FormFactor.Case.options,
    mb_support: FormFactor.Mainboard.options,
    radiator_support: FormFactor.Radiator.options,
    psu_support: FormFactor.PSU.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Case;
