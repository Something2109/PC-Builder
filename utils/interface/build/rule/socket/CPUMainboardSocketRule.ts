import { ProductRule } from "../../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  cpu_socket: [Products.CPU, Infos.CPU_SPEC, "socket"],
  mainboard_socket: [Products.MAIN, Infos.MAIN_SPEC, "socket"],
} as const;

const CPUMainboardSocketRule: ProductRule<typeof attributes> = {
  name: "CPU Mainboard Socket Compatibility Rule",

  attributes,

  validate: (build) => {
    const { cpu_socket, mainboard_socket } = build;

    if (!cpu_socket || !mainboard_socket) {
      return "Not enough information to validate CPU socket compatibility.";
    }

    if (cpu_socket !== mainboard_socket) {
      return `The CPU ${cpu_socket} socket does not match the mainboard socket.`;
    }

    return;
  },

  filter(build) {
    const { cpu_socket, mainboard_socket } = build;
    const result: ReturnType<typeof this.filter> = {};

    if (cpu_socket) {
      result.mainboard_socket = [cpu_socket];
    }

    if (mainboard_socket) {
      result.cpu_socket = [mainboard_socket];
    }

    return result;
  },
};

export default CPUMainboardSocketRule;
