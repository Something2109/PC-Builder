import { PCBuildRule } from "../../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  mainboard_socket: [Products.MAIN, Infos.MAIN_SPEC, "socket"],
  aio_socket: [Products.AIO, Infos.CPU_BLOCK_SOCKET, "socket"],
} as const;

const MainboardAIOSocketRule: PCBuildRule<typeof attributes> = {
  name: "Mainboard AIO Socket Compatibility Rule",

  attributes,

  validate: (build) => {
    const { mainboard_socket, aio_socket } = build;

    if (!mainboard_socket || !aio_socket) {
      return "Not enough information to validate mainboard and AIO socket compatibility.";
    }

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
      result.mainboard_socket = aio_socket;
    }

    return result;
  },
};

export default MainboardAIOSocketRule;
