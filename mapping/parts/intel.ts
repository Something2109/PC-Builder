import { Products } from "@/utils/Enum";
import { PartInformation } from "@/models/parts";
import { CreationAttributes } from "sequelize";

const path = ".\\data\\parts\\arkintel";

async function read(
  raw: any,
  part: Products
): Promise<Omit<CreationAttributes<PartInformation>, "part" | "raw">> {
  return {
    name: raw["Model"],
    code_name: raw["Model"],
    brand: "Intel",
    family: raw["Product Collection"] ?? "Intel Arc A-Series",
    series: raw["Code Name"]
      ? raw["Code Name"].replace("Products formerly ", "")
      : "Alchemist",
    launch_date: raw["Launch Date"],
  };
}

export { path, read };
