import { AttributeRule } from "../../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  cpu_socket: [Products.CPU, Infos.CPU_SPEC, "socket"],
  mainboard_socket: [Products.MAIN, Infos.MAIN_SPEC, "socket"],
} as const;

const CPUMainboardSocketRule: AttributeRule<typeof attributes> = {
  name: "CPU Mainboard Socket Compatibility Rule",

  attributes,

  validate(build) {
    const result: ReturnType<typeof this.validate> = {};
    const { cpu_socket, mainboard_socket } = build;

    if (!cpu_socket) {
      result.cpu_socket = "CPU socket is not specified.";
    }

    if (!mainboard_socket) {
      result.mainboard_socket = "Mainboard socket is not specified.";
    }

    if (!cpu_socket || !mainboard_socket) return result;

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
