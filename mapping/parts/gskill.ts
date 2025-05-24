import { Products } from "@/utils/Enum";
import { PartInformation } from "@/models/parts";
import { CreationAttributes } from "sequelize";

async function read(
  raw: any,
  part: Products
): Promise<Omit<CreationAttributes<PartInformation>, "part" | "raw">> {
  const code_name = raw["Model"].replaceAll(/®|™/g, "");
  const [series] = raw["Model"]?.match(
    /SUPRIM|EXPERT|VENTUS|GAMING( SLIM)?|SHADOW|SEA HAWK|EVOKE|ARMOR|MECH|AERO( ITX)?|MINER|MEG|MPG|MAG|PRO|Creator/
  ) ?? ["CLASSIC"];
  if (!series) {
    throw new Error("Cannot find series name");
  }

  return {
    url: raw["url"],
    image_url: raw["img"],
    name: raw["Model"],
    code_name,
    brand: "MSI",
    series,
  };
}
