import { Database } from "@/models/Database";
import { Products } from "@/models/interface";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { part: string } }
) {
  let page = Number(request.nextUrl.searchParams.get("page"));
  if (page < 1) {
    page = 1;
  }

  if (Object.values(Products).includes(params.part as Products)) {
    const article = Database.sellers.getProducts(params.part as Products, page);

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
