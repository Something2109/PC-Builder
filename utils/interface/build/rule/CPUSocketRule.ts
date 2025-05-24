import { PCBuildRule } from "../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  cpu_socket: [Products.CPU, Infos.CPU_SPEC, "socket"],
  mainboard_socket: [Products.MAIN, Infos.MAIN_SPEC, "socket"],
  cpu_block_socket: [Products.CPU_BLOCK, Infos.CPU_BLOCK_SOCKET, "socket"],
  cooler_socket: [Products.COOLER, Infos.CPU_BLOCK_SOCKET, "socket"],
  aio_socket: [Products.AIO, Infos.CPU_BLOCK_SOCKET, "socket"],
} as const;

const CPUSocketRule: PCBuildRule<typeof attributes> = {
  attributes,

  validate: (build) => {
    const {
      cpu_socket,
      mainboard_socket,
      cpu_block_socket,
      cooler_socket,
      aio_socket,
    } = build;

    const socketList = cpu_block_socket ?? cooler_socket ?? aio_socket;

    if (!cpu_socket || !mainboard_socket || !socketList) return false;

    return cpu_socket === mainboard_socket && socketList.includes(cpu_socket);
  },

  filter(build) {
    const { cpu_socket, mainboard_socket, cpu_block_socket } = build;
    const result: ReturnType<typeof this.filter> = {};

    if (cpu_socket) {
      result.mainboard_socket = [cpu_socket];
      result.cpu_block_socket = [cpu_socket];
    }

    if (mainboard_socket) {
      result.cpu_socket = [mainboard_socket];
      result.cpu_block_socket = [mainboard_socket];
    }

    if (cpu_block_socket && cpu_block_socket.length > 0) {
      result.cpu_socket = cpu_block_socket;
      result.mainboard_socket = cpu_block_socket;
    }

    return result;
  },
};

export default CPUSocketRule;
