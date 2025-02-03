import { GenericDetailTable } from "../TableWrapper";
import AIO from "@/utils/interface/part/AIO";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof AIO.Info]: FunctionComponent<{ value: AIO.Info[key] }>;
} = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
  radiator_width: ({ value }) => value,
  radiator_length: ({ value }) => value,
  radiator_height: ({ value }) => value,
  pump_width: ({ value }) => value,
  pump_length: ({ value }) => value,
  pump_height: ({ value }) => value,
  pump_speed: ({ value }) => value,
};

export default GenericDetailTable(Components, AIO.Label);
