import { Products } from "@/utils/Enum";
import { PartInformation } from "@/models/parts";
import { CreationAttributes } from "sequelize";

const path = "./data/parts/amd";

async function read(
  raw: any,
  part: Products
): Promise<Omit<CreationAttributes<PartInformation>, "part" | "raw">> {
  let family = raw["Family"];
  console.log(family);

  if (!family) {
    family = (raw["Name"] as string).includes("EPYC") ? "EPYC" : "Opteron";
  }
  return {
    name: raw["Name"],
    code_name: raw["Name"],
    brand: "AMD",
    family,
    series: raw["Series"].replace(/[- ]Series/, ""),
    launch_date: raw["Launch Date"],
  };
}

export { path, read };
