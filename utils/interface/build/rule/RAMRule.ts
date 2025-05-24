import { PCBuildRule } from "../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  main_board: [Products.MAIN, Infos.MAIN_SPEC],
  ram: [Products.RAM, Infos.RAM_SPEC],
} as const;

const RAMRule: PCBuildRule<typeof attributes> = {
  attributes,

  validate(build) {
    const validation: string[] = [];

    const { main_board, ram } = build;

    if (
      !main_board ||
      !main_board.ram_form_factor ||
      !main_board.ram_interface ||
      !main_board.ram_slot
    )
      return false;

    if (!ram) return false;

    let ramStick = 0;
    for (const ramSet of ram) {
      if (!ramSet.form_factor || !ramSet.interface || !ramSet.kit) return false;

      if (
        !(
          ramSet.form_factor === main_board.ram_form_factor &&
          ramSet.interface === main_board.ram_interface
        )
      )
        return false;

      ramStick += ramSet.kit;
    }

    return ramStick <= main_board.ram_slot;
  },

  filter(build) {
    const { main_board, ram } = build;
    const result: ReturnType<typeof this.filter> = {};

    if (main_board) {
      result.ram = {};

      if (main_board.ram_form_factor)
        result.ram.form_factor = [main_board.ram_form_factor];

      if (main_board.ram_interface)
        result.ram.interface = [main_board.ram_interface];

      if (main_board.ram_slot && Number(main_board.ram_slot) > 0)
        result.ram.kit = [main_board.ram_slot];
    }

    if (ram && ram.length > 0) {
      result.main_board = {};

      const ram_form_factor = ram
        .map((val) => val.form_factor)
        .filter((val) => val) as string[];
      if (ram_form_factor.length > 0)
        result.main_board.ram_form_factor = ram_form_factor;

      const ram_interface = ram
        .map((val) => val.interface)
        .filter((val) => val) as string[];
      if (ram_interface.length > 0)
        result.main_board.ram_interface = ram_interface;

      const ram_slot = ram.reduce((acc, val) => acc + (val.kit ?? 0), 0);
      if (ram_slot > 0) result.main_board.ram_slot = [ram_slot];
    }

    return result;
  },
};

export default RAMRule;
