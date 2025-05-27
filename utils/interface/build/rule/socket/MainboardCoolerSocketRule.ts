import { ProductRule } from "../../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  mainboard_socket: [Products.MAIN, Infos.MAIN_SPEC, "socket"],
  cooler_socket: [Products.COOLER, Infos.CPU_BLOCK_SOCKET, "socket"],
} as const;

const MainboardCoolerSocketRule: ProductRule<typeof attributes> = {
  name: "Mainboard Cooler Socket Compatibility Rule",

  attributes,

  validate: (build) => {
    const { mainboard_socket, cooler_socket } = build;

    if (!mainboard_socket || !cooler_socket) {
      return "Not enough information to validate CPU socket compatibility.";
    }

    if (!cooler_socket.includes(mainboard_socket)) {
      return `The mainboard ${mainboard_socket} socket is not compatible with the cooler.`;
    }

    return;
  },

  filter(build) {
    const { mainboard_socket, cooler_socket } = build;
    const result: ReturnType<typeof this.filter> = {};

    if (mainboard_socket) {
      result.cooler_socket = [mainboard_socket];
    }

    if (cooler_socket && cooler_socket.length > 0) {
      result.mainboard_socket = cooler_socket.filter(
        (socket) => socket !== undefined
      );
    }

    return result;
  },
};

export default MainboardCoolerSocketRule;
