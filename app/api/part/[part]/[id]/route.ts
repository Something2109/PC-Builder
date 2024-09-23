import { Database } from "@/models/Database";
import { Products } from "@/utils/Enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { part, id } }: { params: { part: string; id: string } }
) {
  let page = Number(request.nextUrl.searchParams.get("page"));
  if (page < 1) {
    page = 1;
  }

  if (Object.values(Products).includes(part as Products)) {
    const article = await Database.parts.get(part as Products, id);

    if (article) {
      return NextResponse.json(article);
    }
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
