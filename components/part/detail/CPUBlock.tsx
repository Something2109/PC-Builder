import CPUBlock from "@/utils/interface/part/info/CPUBlock";
import { InfoComponentObject } from "../utils/Table";
import { GenericDetailTable } from "../TableWrapper";

const Components: InfoComponentObject<CPUBlock.Info> = {
  socket: ({ value }) => value?.join(", "),
  plate: ({ value }) => value,
  rgb: ({ value }) => value,
};

export default GenericDetailTable(Components, CPUBlock.Label);
