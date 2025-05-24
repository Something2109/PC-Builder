import { Products } from "@/utils/Enum";
import { PartInformation } from "@/models/parts";
import { CreationAttributes } from "sequelize";

const seriesName: Record<string, string> = {
  ASUS: "Asus",
  PRIME: "Prime",
  DUAL: "Dual",
  TUF: "TUF",
  ROG: "ROG",
  KO: "ko",
  PH: "Phoenix",
  PROART: "ProArt",
  TURBO: "Turbo",
  CERBERUS: "Cerberus",
  NOCTUA: "Noctua",
  EK: "EKWB",
  EX: "Expedition",
  WS: "Workstation",
};
const seriesRegex = new RegExp(Object.keys(seriesName).join("|"), "ig");

const path = "./data/parts/odinapiasus";

async function read(
  raw: any,
  part: Products
): Promise<Omit<CreationAttributes<PartInformation>, "part" | "raw">> {
  const url = raw["url"] as string;
  const code_name = url
    .slice(url.lastIndexOf("/", url.length - 2) + 1, url.length - 1)
    .toUpperCase();
  const [series] = code_name.match(seriesRegex) ?? ["ASUS"];

  return {
    name: raw["Model"],
    code_name,
    brand: "Asus",
    series: seriesName[series] ?? series,

    url,
    image_url: raw["img"],
  };
}

export { path, read };
