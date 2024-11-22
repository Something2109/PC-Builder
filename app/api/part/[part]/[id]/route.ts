import { Database } from "@/models/Database";
import { Products } from "@/utils/Enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { part, id } }: { params: { part: string; id: string } }
) {
  if (Object.values(Products).includes(part as Products)) {
    const partInfo = await Database.parts.get(part as Products, id);

    if (partInfo && partInfo.part === part) {
      return NextResponse.json(partInfo);
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
