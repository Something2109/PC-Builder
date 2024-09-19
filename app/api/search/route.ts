import { Database } from "@/models/Database";
import { SearchString } from "@/utils/SearchString";
import { SearchParams } from "@/utils/SearchParams";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let search = request.nextUrl.searchParams.get("q") ?? "";

  const options = {
    ...SearchParams.toFilterOptions(request.nextUrl.searchParams),
    ...SearchParams.toPageOptions(request.nextUrl.searchParams),
  };

  const { str, part } = SearchString.toProducts(search);
  if (!options.part && part.length > 0) options.part = part;

  const responseList = await Database.parts.search(str, options);

  return NextResponse.json(responseList);
}
