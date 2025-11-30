import { AttributeRule } from "../../utils";
import { Infos, Products } from "@/utils/part";

const attributes = {
  mainboard_socket: [Products.MAIN, Infos.MAIN_SPEC, "socket"],
  cooler_socket: [Products.COOLER, Infos.CPU_BLOCK_SOCKET, "socket"],
} as const;

const MainboardCoolerSocketRule: AttributeRule<typeof attributes> = {
  name: "Mainboard Cooler Socket Compatibility Rule",

  attributes,

  validate(build) {
    const result: ReturnType<typeof this.validate> = {};
    const { mainboard_socket, cooler_socket } = build;

    if (!mainboard_socket) {
      result.mainboard_socket = "Mainboard socket is not specified.";
    }

    if (cooler_socket.length === 0) {
      result.cooler_socket = "Cooler socket is not specified.";
    }

    if (!mainboard_socket || cooler_socket.length === 0) return result;

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
