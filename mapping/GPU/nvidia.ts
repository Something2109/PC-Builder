import { Connection } from "@/models/Connection";
import fs from "node:fs";

const errors: {
  data: any[];
  error: string;
}[] = [];

async function read(data: any[]) {}

const data = JSON.parse(
  fs.readFileSync("./data/parts/nvidia/gpu.json").toString()
);
console.log(data.length);

Connection.sync().then(() =>
  read(data).then(() => fs.writeFileSync("error.json", JSON.stringify(errors)))
);
