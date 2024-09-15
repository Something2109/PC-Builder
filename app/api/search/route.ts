import { Database } from "@/models/Database";
import { Products } from "@/utils/Enum";
import { Extract } from "@/utils/Extract";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let search = request.nextUrl.searchParams.get("q") ?? "";
  const partParams = request.nextUrl.searchParams.get("part");
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "50");

  let { str, part } = Extract.products(search);
  if (partParams) part = partParams.split(",") as Products[];

  const responseList = await Database.parts.search(str, {
    page,
    limit,
    part: part.length > 0 ? part : undefined,
  });

  return NextResponse.json(responseList);
}
