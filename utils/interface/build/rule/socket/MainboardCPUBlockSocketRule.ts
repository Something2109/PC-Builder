import { ProductRule } from "../../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  mainboard_socket: [Products.MAIN, Infos.MAIN_SPEC, "socket"],
  cpu_block_socket: [Products.CPU_BLOCK, Infos.CPU_BLOCK_SOCKET, "socket"],
} as const;

const MainboardCPUBlockSocketRule: ProductRule<typeof attributes> = {
  name: "CPU Socket Compatibility Rule",

  attributes,

  validate: (build) => {
    const { mainboard_socket, cpu_block_socket } = build;

    if (!mainboard_socket || !cpu_block_socket) {
      return "Not enough information to validate CPU socket compatibility.";
    }

    if (!cpu_block_socket.includes(mainboard_socket)) {
      return `The mainboard ${mainboard_socket} socket is not compatible with the CPU block.`;
    }

    return;
  },

  filter(build) {
    const { mainboard_socket, cpu_block_socket } = build;
    const result: ReturnType<typeof this.filter> = {};

    if (mainboard_socket) {
      result.cpu_block_socket = [mainboard_socket];
    }

    if (cpu_block_socket && cpu_block_socket.length > 0) {
      result.mainboard_socket = cpu_block_socket;
    }

    return result;
  },
};

export default MainboardCPUBlockSocketRule;
