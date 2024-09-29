import { Database } from "@/models/Database";
import { Products } from "@/utils/Enum";
import { FilterOptions } from "@/utils/interface";
import { SearchParams } from "@/utils/SearchParams";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params: { part } }: { params: { part: string } }
) {
  try {
    if (!Object.values(Products).includes(part as Products)) {
      throw new Error(
        "Cannot find the part you need. Check if the path is correct"
      );
    }

    const options: FilterOptions = {
      ...((await request.json()) ?? {}),
      ...SearchParams.toPageOptions(request.nextUrl.searchParams),
    };
    options.part = { part: [part], ...options.part };

    const data = await Database.parts.list(options);

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
