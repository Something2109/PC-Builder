import {
  AIOFormFactorType,
  CaseFormFactors,
  CaseSide,
  CaseSideType,
  FanFormFactorType,
  MainboardFormFactors,
  PSUFormFactors,
  FanFormFactors,
  FilterOptions,
} from "../utils";
import { z } from "zod";

export namespace Case {
  const AIOSupportSchema = z.record(CaseSide, z.number());

  const FanSupportSchema = z.record(
    CaseSide,
    z.record(FanFormFactors, z.number())
  );

  const HardDriveSupportSchema = z
    .object({
      2.5: z.number(),
      3.5: z.number(),
      combo: z.number(),
    })
    .partial();

  export const Schema = z.object({
    form_factor: CaseFormFactors,

    width: z.number(),
    length: z.number(),
    height: z.number(),

    io_ports: z.object({}),

    mb_support: MainboardFormFactors,
    expansion_slot: z.number(),

    max_cooler_height: z.number(),

    aio_support: AIOSupportSchema,
    fan_support: FanSupportSchema,

    hard_drive_support: HardDriveSupportSchema,

    psu_support: PSUFormFactors,
    max_psu_length: z.number(),
  });

  export type FanSupport = z.infer<typeof FanSupportSchema>;

  export type AIOSupport = z.infer<typeof AIOSupportSchema>;

  export type HardDriveSupport = z.infer<typeof HardDriveSupportSchema>;

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    form_factor: true,
    mb_support: true,
    psu_support: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(CaseFormFactors),
      mb_support: FilterOptions(MainboardFormFactors),
      psu_support: FilterOptions(PSUFormFactors),
    })
    .partial();

  export const DefaultFilterOptions = {
    form_factor: CaseFormFactors.options,
    mb_support: MainboardFormFactors.options,
    psu_support: PSUFormFactors.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Case;
