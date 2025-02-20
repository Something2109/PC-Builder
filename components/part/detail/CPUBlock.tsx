import CPUBlock from "@/utils/interface/info/CPUBlock";
import { GenericDetailTable, InfoDetailMapping } from "../TableWrapper";

const Components: InfoDetailMapping<CPUBlock.Info> = {
  socket: ({ value }) => value?.join(", "),
  plate: ({ value }) => value,
  rgb: ({ value }) => value,
};

export default GenericDetailTable(Components, CPUBlock.Label);
