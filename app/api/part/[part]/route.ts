import { Database } from "@/models/Database";
import { Products } from "@/utils/Enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { part } }: { params: { part: string } }
) {
  let page = Number(request.nextUrl.searchParams.get("page"));
  if (page < 1) {
    page = 1;
  }

  if (Object.values(Products).includes(part as Products)) {
    const data = await Database.parts.list({ part: [part as Products], page });

    return NextResponse.json(data);
  }

  return NextResponse.json(
    {
      message: "Cannot find the part you need. Check if the path is correct",
    },
    {
      status: 404,
    }
  );
}
