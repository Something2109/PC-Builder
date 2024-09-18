import { Database } from "@/models/Database";
import { Extract } from "@/utils/Extract";
import { SearchParams } from "@/utils/SearchParams";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let search = request.nextUrl.searchParams.get("q") ?? "";

  const options = {
    ...SearchParams.toFilterOptions(request.nextUrl.searchParams),
    ...SearchParams.toPageOptions(request.nextUrl.searchParams),
  };

  const { str, part } = Extract.products(search);
  if (!options.part && part.length > 0) options.part = part;

  const responseList = await Database.parts.search(str, options);

  return NextResponse.json(responseList);
}
