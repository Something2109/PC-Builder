import { Products } from "@/utils/Enum";
import { PartInformation } from "@/models/parts";
import { CreationAttributes } from "sequelize";

const path = "./data/parts/gigabyte";

async function read(
  raw: any,
  part: Products
): Promise<Omit<CreationAttributes<PartInformation>, "part" | "raw">> {
  const url = raw["url"] as string;
  const code_name = url.slice(url.lastIndexOf("/") + 1).toUpperCase();
  const [series] = raw["Model"]?.match(/AORUS|EAGLE|AERO/) ?? ["GAMING"];
  if (!series) {
    throw new Error("Cannot find series name");
  }

  return {
    name: raw["Model"],
    code_name,
    brand: "Gigabyte",
    series,

    url,
    image_url: raw["img"],
  };
}

export { path, read };
