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

export async function POST(request: NextRequest) {
  try {
    let { id, ...data } = await request.json();

    const responseList = await Database.parts.set(data, id);
    if (!responseList) {
      return NextResponse.json(
        { message: "There's an error finding filter for your option" },
        { status: 500 }
      );
    }

    return NextResponse.json(responseList);
  } catch (err: any) {
    console.error(err);
    let message = (err as Error).message;
    if (err.errors) {
      switch (err.errors[0].validatorKey) {
        case "not_unique":
          message = "The code name has existed in the database";
          break;
        case "isUrl":
          message = "The url field provided is not an url";
          break;
        default:
          message = "Problem saving into the database";
      }
    }
    return NextResponse.json({ message }, { status: 400 });
  }
}
