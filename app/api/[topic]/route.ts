import { Database } from "@/models/Database";
import { Topics } from "@/utils/Enum";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { topic: string } }
) {
  try {
    if (!Object.values(Topics).includes(params.topic as Topics)) {
      throw new Error(
        `Cannot find the topic ${params.topic}. Check if the path is correct`
      );
    }

    const article = await Database.articles.getSummary({
      topic: params.topic as Topics,
    });

    return NextResponse.json(article);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 404,
      }
    );
  }
}
