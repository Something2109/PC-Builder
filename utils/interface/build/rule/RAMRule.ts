import { BuildAttributeValue, BuildResultValue, ProductRule } from "../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  main_board_interface: [Products.MAIN, Infos.MAIN_SPEC, "ram_interface"],
  main_board_form_factor: [Products.MAIN, Infos.MAIN_SPEC, "ram_form_factor"],
  main_board_slot: [Products.MAIN, Infos.MAIN_SPEC, "ram_slot"],

  rams: [Products.RAM, Infos.RAM_SPEC],
} as const;

function RAMValidate(
  ram: BuildAttributeValue<typeof attributes, "rams">,
  ram_interface: BuildAttributeValue<typeof attributes, "main_board_interface">,
  form_factor: BuildAttributeValue<typeof attributes, "main_board_form_factor">
): BuildResultValue<typeof attributes, "rams"> | string | undefined {
  if (!ram) return "No RAM information.";

  const result: string[] = [];

  if (!ram.interface) {
    result.push("RAM interface is not specified.");
  } else if (ram_interface && ram.interface !== ram_interface) {
    result.push(
      `The RAM interface ${ram.interface} is not compatible with the mainboard interface ${ram_interface}.`
    );
  }

  if (!ram.form_factor) {
    result.push("RAM form factor is not specified.");
  } else if (form_factor && ram.form_factor !== form_factor) {
    result.push(
      `The RAM form factor ${ram.form_factor} is not compatible with the mainboard form factor ${form_factor}.`
    );
  }

  if (!ram.kit) result.push("RAM kit is not specified.");

  return result;
}

const RAMRule: ProductRule<typeof attributes> = {
  name: "RAM Compatibility Rule",

  attributes,

  validate(build) {
    const result: ReturnType<typeof this.validate> = {};
    const {
      main_board_interface,
      main_board_form_factor,
      main_board_slot,
      rams,
    } = build;

    if (!main_board_interface) {
      result.main_board_interface = "Mainboard ram interface is not specified.";
    }

    if (!main_board_form_factor) {
      result.main_board_form_factor =
        "Mainboard ram form factor is not specified.";
    }

    if (!main_board_slot) {
      result.main_board_slot = "Mainboard ram slot is not specified.";
    }

    if (
      !main_board_interface &&
      !main_board_form_factor &&
      !main_board_slot &&
      (!rams || rams.length === 0)
    )
      return result;

    if (rams)
      result.rams = rams.map((ram) =>
        RAMValidate(ram, main_board_interface, main_board_form_factor)
      );

    const totalRAMKits =
      rams?.reduce((acc, ram) => acc + (ram?.kit ?? 0), 0) ?? 0;
    if (main_board_slot && totalRAMKits > main_board_slot)
      result.main_board_slot = `The total RAM stick(s): ${totalRAMKits} exceed the mainboard's ${main_board_slot} RAM slot capacity.`;

    return result;
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
        .map((ram) => ram && ram.form_factor)
        .filter((val) => val !== undefined);
      if (ram_form_factors.length > 0)
        result.main_board_form_factor = ram_form_factors.filter(
          (val) => val !== undefined
        );

      const ram_interfaces = rams
        .map((ram) => ram && ram.interface)
        .filter((val) => val !== undefined);
      if (ram_interfaces.length > 0)
        result.main_board_interface = ram_interfaces.filter(
          (val) => val !== undefined
        );

      const ram_kits = rams.reduce((acc, ram) => acc + (ram?.kit ?? 0), 0);
      if (ram_kits > 0) result.main_board_slot = [ram_kits];
    }

    return result;
  },
};

export default RAMRule;
