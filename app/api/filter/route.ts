import { Database } from "@/models/Database";
import { SearchParams } from "@/utils/SearchParams";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let search = request.nextUrl.searchParams.get("q") ?? "";

  const options = {
    ...SearchParams.toFilterOptions(request.nextUrl.searchParams),
  };

  const responseList = await Database.parts.filter(search, options);

  return NextResponse.json(responseList);
}
