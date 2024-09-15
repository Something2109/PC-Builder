import { Database } from "@/models/Database";
import { Products } from "@/utils/Enum";
import { PartInformationType } from "@/models/parts/Part";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const responseList: {
    [key in Products]?: PartInformationType[];
  } = {};

  const promises = Object.values(Products).map((product) =>
    Database.parts
      .list({ part: [product], limit: 10 })
      .then((data) => (responseList[product] = data.list))
  );

  await Promise.all(promises);

  return NextResponse.json(responseList);
}
