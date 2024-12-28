import { FormFactor, FilterOptions, ExternalPorts } from "../utils";
import { z } from "zod";

export namespace Case {
  export const Side = z.enum(["top", "bottom", "front", "rear", "side"]);

  export type SideType = z.infer<typeof Side>;

  export const AIOSupportSchema = z.record(Side, z.array(FormFactor.AIO));

  export type AIOSupportType = z.infer<typeof AIOSupportSchema>;

  export const FanSupportSchema = z.record(
    Side,
    z.record(FormFactor.Fan, z.number())
  );

  export type FanSupportType = z.infer<typeof FanSupportSchema>;

  export const HardDriveSize = z.enum(["2.5", "3.5"]);

  export type HardDriveSizeType = z.infer<typeof HardDriveSize>;

  export const HardDriveSupportSchema = z.record(
    z.union([z.literal("Drive Bay"), Side]),
    z.record(HardDriveSize, z.number())
  );

  export type HardDriveSupportType = z.infer<typeof HardDriveSupportSchema>;

  export const FrontPanelPortSchema = z.record(
    ExternalPorts.Schema,
    z.number()
  );

  export type FrontPanelPortType = z.infer<typeof FrontPanelPortSchema>;

  export const Schema = z.object({
    form_factor: FormFactor.Case,

    width: z.number(),
    length: z.number(),
    height: z.number(),

    mainboard_support: z.array(FormFactor.Mainboard),
    expansion_slot: z.number(),

    max_cooler_height: z.number(),

    aio_support: AIOSupportSchema,
    fan_support: FanSupportSchema,

    hard_drive_support: HardDriveSupportSchema,

    psu_support: z.array(FormFactor.PSU),
    max_psu_length: z.number(),

    front_panel_ports: FrontPanelPortSchema,
  });

  export type FanSupport = z.infer<typeof FanSupportSchema>;

  export type AIOSupport = z.infer<typeof AIOSupportSchema>;

  export type HardDriveSupport = z.infer<typeof HardDriveSupportSchema>;

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    form_factor: true,
    mainboard_support: true,
    psu_support: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(FormFactor.Case),
      mainboard_support: FilterOptions(FormFactor.Mainboard),
      psu_support: FilterOptions(FormFactor.PSU),
    })
    .partial();

  export const DefaultFilterOptions = {
    form_factor: FormFactor.Case.options,
    mb_support: FormFactor.Mainboard.options,
    psu_support: FormFactor.PSU.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Case;
