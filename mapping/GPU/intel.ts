import fs from "node:fs";
import { Connection } from "@/models/Connection";

const errors: {
  data: any[];
  error: string;
}[] = [];

async function read(gpu: any) {
  try {
  } catch (err) {
    const error = err as Error;
    gpu["error"] = error.message;
    console.log(error);
    errors.push(gpu);
  }
}

const data = JSON.parse(
  fs.readFileSync("./data/parts/arkintel/gpu.json").toString()
);
console.log(data.length);

Connection.sync().then(() =>
  Promise.all(data.map((cpu: any) => read(cpu))).then(() =>
    fs.writeFileSync("error.json", JSON.stringify(errors))
  )
);
