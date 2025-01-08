import Radiator from "@/utils/interface/part/Radiator";
import { FormFactor, Material } from "@/utils/interface/utils";
import {
  TableWrapper,
  InputRow,
  SelectInputRow,
  DimensionInputRow,
} from "../TableWrapper";
import { TableHTMLAttributes } from "react";

export default function RadiatorTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Radiator.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <SelectInputRow
        name="form_factor"
        label="Form Factor"
        options={FormFactor.Pump.options}
        defaultValue={defaultValue?.form_factor}
      />
      <DimensionInputRow defaultValue={defaultValue} />
      <InputRow
        type="number"
        name="fpi"
        label="FPI"
        defaultValue={defaultValue?.fpi}
      />
      <SelectInputRow
        name="material"
        label="Material"
        options={Material.Metal.options}
        defaultValue={defaultValue?.material}
      />
    </TableWrapper>
  );
}
