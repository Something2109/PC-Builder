import { Database } from "@/models/Database";
import { Products } from "@/models/interface";
import { SellerProduct } from "@/models/sellers/SellerProduct";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const responseList: {
    [key in Products]?: SellerProduct[];
  } = {};

  Object.values(Products).forEach((product) => {
    responseList[product] = Database.sellers.getProducts(product, 1, 10).list;
  });

  return NextResponse.json(responseList);
}
