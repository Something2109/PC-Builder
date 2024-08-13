import { Database } from "@/models/Database";
import { Products } from "@/models/interface";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { part: string } }
) {
  if (Object.values(Products).includes(params.part as Products)) {
    const article = Database.articles.getIntroduction(params.part as Products);

    if (article) {
      return NextResponse.json(article);
    }
  }
  return NextResponse.json(
    {
      message: "Cannot find the article you need. Check if the path is correct",
    },
    {
      status: 404,
    }
  );
}
