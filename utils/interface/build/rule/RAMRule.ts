import { ProductRule } from "../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  main_board_interface: [Products.MAIN, Infos.MAIN_SPEC, "ram_interface"],
  main_board_form_factor: [Products.MAIN, Infos.MAIN_SPEC, "ram_form_factor"],
  main_board_slot: [Products.MAIN, Infos.MAIN_SPEC, "ram_slot"],

  rams: [Products.RAM, Infos.RAM_SPEC],
} as const;

const RAMRule: ProductRule<typeof attributes> = {
  name: "RAM Compatibility Rule",

  attributes,

  validate(build) {
    const {
      main_board_interface,
      main_board_form_factor,
      main_board_slot,
      rams,
    } = build;

    if (
      !main_board_interface ||
      !main_board_form_factor ||
      !main_board_slot ||
      !rams ||
      rams.length === 0
    )
      return "Not enough information to validate RAM compatibility.";

    const incompatibleformFactor = rams.filter(
      (val) => val.form_factor !== main_board_form_factor
    );
    if (incompatibleformFactor.length > 0)
      return `The RAM ${incompatibleformFactor.join(
        ", "
      )} form factor does not match the mainboard ${main_board_form_factor} form factor.`;

    const incompatibleInterface = rams.filter(
      (val) => val.interface !== main_board_interface
    );
    if (incompatibleInterface.length > 0)
      return `The RAM ${incompatibleInterface.join(
        ", "
      )} interface does not match the mainboard ${main_board_interface} interface.`;

    const totalRAMKits = rams.reduce((acc, curr) => acc + (curr?.kit ?? 0), 0);
    if (totalRAMKits > main_board_slot)
      return `The total RAM stick(s): ${totalRAMKits} exceed the mainboard's ${main_board_slot} RAM slot capacity.`;
  },

  filter(build) {
    const {
      main_board_interface,
      main_board_form_factor,
      main_board_slot,
      rams,
    } = build;
    const result: ReturnType<typeof this.filter> = {};

    if (main_board_interface) {
      result.rams = { ...result.rams, interface: [main_board_interface] };
    }

    if (main_board_form_factor) {
      result.rams = { ...result.rams, form_factor: [main_board_form_factor] };
    }

    if (main_board_slot) {
      const vacantSlots =
        rams?.reduce((acc, curr) => acc - (curr?.kit ?? 0), main_board_slot) ??
        main_board_slot;

      if (vacantSlots > 0) {
        result.rams = { ...result.rams, kit: [main_board_slot] };
      }
    }

    if (rams && rams.length > 0) {
      const ram_form_factors = rams
        .map((ram) => ram.form_factor)
        .filter((val) => val !== undefined);
      if (ram_form_factors.length > 0)
        result.main_board_form_factor = ram_form_factors;

      const ram_interfaces = rams
        .map((ram) => ram.interface)
        .filter((val) => val !== undefined);
      if (ram_interfaces.length > 0)
        result.main_board_interface = ram_interfaces;

      const ram_kits = rams.reduce((acc, ram) => acc + (ram?.kit ?? 0), 0);
      if (ram_kits > 0) result.main_board_slot = [ram_kits];
    }

    return result;
  },
};

export default RAMRule;
