import { AttributeRule } from "../../utils";
import { Infos, Products } from "@/utils/part";

const attributes = {
  mainboard_socket: [Products.MAIN, Infos.MAIN_SPEC, "socket"],
  aio_socket: [Products.AIO, Infos.CPU_BLOCK_SOCKET, "socket"],
} as const;

const MainboardAIOSocketRule: AttributeRule<typeof attributes> = {
  name: "Mainboard AIO Socket Compatibility Rule",

  attributes,

  validate(build) {
    const result: ReturnType<typeof this.validate> = {};
    const { mainboard_socket, aio_socket } = build;

    if (!mainboard_socket) {
      result.mainboard_socket = "Mainboard socket is not specified.";
    }

    if (aio_socket.length === 0) {
      result.aio_socket = "AIO socket is not specified.";
    }

    if (!mainboard_socket || aio_socket.length === 0) return result;

    if (!aio_socket.includes(mainboard_socket)) {
      return `The mainboard ${mainboard_socket} socket is not compatible with the AIO.`;
    }

    return;
  },

  filter(build) {
    const { mainboard_socket, aio_socket } = build;
    const result: ReturnType<typeof this.filter> = {};

    if (mainboard_socket) {
      result.aio_socket = [mainboard_socket];
    }

    if (aio_socket && aio_socket.length > 0) {
      result.mainboard_socket = aio_socket.filter((socket) => socket !== undefined);
    }

    return result;
  },
};

export default MainboardAIOSocketRule;
