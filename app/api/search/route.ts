import { Database } from "@/models/Database";
import { SearchString } from "@/utils/SearchString";
import { SearchParams } from "@/utils/SearchParams";
import { NextRequest, NextResponse } from "next/server";
import { FilterOptions } from "@/utils/interface";

export async function POST(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("q") ?? "";
    const { str, part } = SearchString.toProducts(search);

    const options: FilterOptions = {
      ...((await request.json()) ?? {}),
      ...SearchParams.toPageOptions(request.nextUrl.searchParams),
    };
    if (!options.part || !options.part.part || options.part.part.length == 0) {
      if (part.length > 0) {
        options.part = { part };
      }
    }

    const data = await Database.parts.search(str, options);

    if (!data) {
      return NextResponse.json(
        { message: "There's an error finding filter for your option" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 400 }
    );
  }
}
