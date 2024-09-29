import { Database } from "@/models/Database";
import { Products } from "@/utils/Enum";
import Part from "@/utils/interface/part/Parts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const responseList: {
    [key in Products]?: Part.BasicInfo[];
  } = {};

  const promises = Object.values(Products).map((product) =>
    Database.parts
      .list({ part: { part: [product] }, limit: 10 })
      .then((data) => {
        if (data) responseList[product] = data.list;
      })
  );

  await Promise.all(promises);

  return NextResponse.json(responseList);
}
