import { Database } from "@/models/Database";
import { FilterOptionSchema } from "@/utils/interface";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let body = await request.json();
    const options = FilterOptionSchema.parse(body);
    const q = body.q ?? "";

    const responseList = await Database.parts.filter(options);

    if (!responseList) {
      return NextResponse.json(
        { message: "There's an error finding filter for your option" },
        { status: 500 }
      );
    }

    return NextResponse.json(responseList);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 400 }
    );
  }
}
