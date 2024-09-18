import { Database } from "@/models/Database";
import { Products } from "@/utils/Enum";
import { SearchParams } from "@/utils/SearchParams";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { part } }: { params: { part: string } }
) {
  try {
    if (!Object.values(Products).includes(part as Products)) {
      throw new Error(
        "Cannot find the part you need. Check if the path is correct"
      );
    }

    const options = {
      ...SearchParams.toFilterOptions(request.nextUrl.searchParams),
      ...SearchParams.toPageOptions(request.nextUrl.searchParams),
    };
    options.part = [part];

    const data = await Database.parts.list(options);

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      {
        message: (err as Error).message,
      },
      {
        status: 404,
      }
    );
  }
}
