import fs from "node:fs";
import { Connection } from "@/models/Connection";

const errors: {
  data: any[];
  error: string;
}[] = [];

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
};

async function read(card: any) {
  try {
  } catch (err) {
    const error = err as Error;
    card["error"] = error.message;
    console.log(error);
    errors.push(card);
  }
}

const data = JSON.parse(
  fs.readFileSync("data\\parts\\odinapiasus\\gpu.json").toString()
  // fs.readFileSync("error.json").toString()
);
console.log(data.length);

Connection.sync().then(() =>
  Promise.all(data.map((cpu: any) => read(cpu))).then(() =>
    fs.writeFileSync("error.json", JSON.stringify(errors))
  )
);
